<script setup lang="ts">
import { useClientHandle } from '@urql/vue'
import LeakyPaywallContent from './LeakyPaywallContent.vue'
import { sendTrack } from '~/lib/tracking'
import { version } from '~/utils/version'

const { height } = useScrollHeight()
const { y } = useWindowScroll()
const show = ref(false)

initConfig()

const config = useStore($config)
const paywall = useStore($paywall)

useTrackManager()

const foundArticle = useFindArticle()

const paywallEnabled = usePaywallEnabled()
const location = useBrowserLocation()
const isArticle = logicAnd(() => config.value.flags.paywall, logicOr(foundArticle, paywallEnabled))

const now = Date.now()
const currentReadIdentifier = computed(() => `${location.value.pathname ?? ''}:${now}`)

const isOverFreeLimit = useOverFreeLimit()

useTrackLink(
  computed(() => foundArticle.value?.element),
  (href) => ({
    event: 'article.hyperlink.clicked',
    properties: {
      // Impossible to be null
      article_id: foundArticle.value?.id ?? '',
      client_id: config.value.clientId,
      href,
      pathname: location.value.pathname ?? '',
    },
  }),
)

const { percentage, lastPercentage } = useTrackScrollDepth(computed(() => foundArticle.value?.element as HTMLElement))

whenever(percentage, (percentage) => {
  sendTrack('article.read', {
    pathname: location.value.pathname ?? '',
    client_id: config.value.clientId,
    article_id: foundArticle.value?.id ?? null,
    percentage,
  })
})

const { trackTextCopy, trackTextSelection } = useTrackTextAction(
  computed(() => foundArticle.value?.element as HTMLElement),
)

trackTextSelection((selectedText) => ({
  event: 'article.text.selected',
  properties: {
    pathname: location.value.pathname ?? '',
    client_id: config.value.clientId,
    article_id: foundArticle.value?.id ?? null,
    text_selection: selectedText,
  },
}))
trackTextCopy((copiedText) => ({
  event: 'article.text.copied',
  properties: {
    pathname: location.value.pathname ?? '',
    client_id: config.value.clientId,
    article_id: foundArticle.value?.id ?? null,
    text_copy: copiedText,
  },
}))

watch(
  location,
  (loc) => {
    sendTrack('page.viewed', {
      pathname: loc.pathname ?? '',
    })

    if (paywallEnabled.value || foundArticle.value) {
      sendTrack('article.viewed', {
        pathname: location.value.pathname ?? '',
        client_id: config.value.clientId,
        article_id: foundArticle.value?.id ?? null,
      })
    }

    if (!isArticle.value) {
      return
    }
    // Don't record as read article or it will be free to read
    if (isOverFreeLimit.value) {
      return
    }
    pushRead(currentReadIdentifier.value)
  },
  { immediate: true },
)

const emailInput = ref('')

const isAllowFree = computed(() => !isOverFreeLimit.value || paywall.value.read.includes(currentReadIdentifier.value))
const isViewportOverThreshold = computedEager(() => {
  if (config.value.paywallTrigger.type !== 'viewport') {
    return false
  }

  return y.value > height.value * config.value.paywallTrigger.value
})
const isArticleScrollOverThreshold = computedEager(() => {
  const scrollPercentage = lastPercentage.value
  if (config.value.paywallTrigger.type !== 'article' || scrollPercentage == null) {
    return false
  }

  // we already times 100 here, need to apply to paywallTrigger config
  return scrollPercentage > config.value.paywallTrigger.value * 100
})

// We need paywall if meet the follow conditions
// 1. current page is article
// 2. user is run out of free read limit and current article is not read before
// 3. user scroll match trigger condition
// We need to measure scroll top first, or paywall will not appear because of cache in Vue
const isNeedPaywall = computed(
  () => (isViewportOverThreshold.value || isArticleScrollOverThreshold.value) && isArticle.value && !isAllowFree.value,
)

// Unlock scroll if user scroll up
useEventListener(window, 'wheel', (event) => {
  if (event.deltaY <= -5) {
    if (show.value) {
      sendTrack('paywall.canceled', {
        article_id: foundArticle.value?.id ?? null,
        client_id: config.value.clientId,
        pathname: location.value.pathname ?? '',
        type: 'scroll_back',
      })
    }
    show.value = false
  } else if (event.deltaY >= 5 && isNeedPaywall.value) {
    // if user keep scroll up and down around the threshold, the user may bypass the paywall
    // this is another check to fix this
    activatePaywall()
  }
})

function activatePaywall() {
  // Don't show paywall if user is logged in
  if (paywall.value.token) {
    return
  }

  sendTrack('paywall.activated', {
    pathname: location.value.pathname ?? '',
    article_id: foundArticle.value?.id ?? null,
    client_id: config.value.clientId,
  })

  show.value = true
}

whenever(
  // When user scroll over 40% will open paywall
  isNeedPaywall,
  activatePaywall,
  { immediate: true },
)

// Close dialog if user login
whenever(
  () => paywall.value.token,
  () => {
    show.value = false
  },
)

// Track scroll over threshold
whenever(
  isViewportOverThreshold,
  () => {
    sendTrack('paywall.reached', {
      pathname: location.value.pathname ?? '',
      article_id: foundArticle.value?.id ?? null,
      client_id: config.value.clientId,
    })
  },
  { immediate: true },
)

// Provide global debug info
onMounted(() => {
  // @ts-expect-error inject global
  window.__spph = reactive({
    _y: y,
    _s: isViewportOverThreshold,
    _b: isArticleScrollOverThreshold,
    _a: foundArticle,
    _h: height,
    _d: isNeedPaywall,
    _i: currentReadIdentifier,
    _c: config,
    _p: paywall,
    _o: isOverFreeLimit,
    _v: show,
    _t: sendTrack,
    _z: version,
    _u: useClientHandle(),
    show: (v = true) => (show.value = v),
  })
})

function handleSignedIn() {
  sendTrack('subscriber.signed_in', {
    pathname: location.value.pathname ?? '',
    // impossible to be empty
    article_id: foundArticle.value?.id ?? '',
    client_id: config.value.clientId,
  })
}
</script>

<template>
  <div>
    <AlertDialog v-model:open="show">
      <AlertDialogContent>
        <VisuallyHidden>
          <!-- for accessibility -->
          <AlertDialogTitle class="invisible">Subscribe</AlertDialogTitle>
        </VisuallyHidden>
        <LeakyPaywallContent v-model:email="emailInput" :config="config" @signed-in="handleSignedIn" />
      </AlertDialogContent>
    </AlertDialog>
    <VisuallyHidden>
      <!-- preload logo file -->
      <img :src="config.logo" />
    </VisuallyHidden>
  </div>
</template>
