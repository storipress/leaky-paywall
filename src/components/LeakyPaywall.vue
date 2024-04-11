<script setup lang="ts">
import { sendTrack } from '~/lib/tracking'
import { version } from '~/utils/version'

const { height } = useScrollHeight()
const { y } = useWindowScroll()
const show = ref(false)

initConfig()

const config = useStore($config)
const paywall = useStore($paywall)

const themeConfig = computed(() => ({
  '--sp-primary': config.value.primaryColor,
}))

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
    event: 'article.link_click',
    properties: {
      // Impossible to be null
      article_id: foundArticle.value?.id ?? '',
      client_id: config.value.clientId,
      href,
      pathname: location.value.pathname ?? '',
    },
  }),
)

const { percentage } = useTrackScrollDepth(computed(() => foundArticle.value?.element as HTMLElement))

whenever(percentage, (percentage) => {
  sendTrack('article.scroll_depth', {
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
  event: 'article.text_selection',
  properties: {
    pathname: location.value.pathname ?? '',
    client_id: config.value.clientId,
    article_id: foundArticle.value?.id ?? null,
    text_selection: selectedText,
  },
}))
trackTextCopy((copiedText) => ({
  event: 'article.text_copy',
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
    sendTrack('page.view', {
      pathname: loc.pathname ?? '',
    })

    if (paywallEnabled.value || foundArticle.value) {
      sendTrack('article.view', {
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

// Unlock scroll if user scroll up
useEventListener(window, 'wheel', (event) => {
  if (event.deltaY <= -5) {
    if (show.value) {
      sendTrack('article.scroll_back', {
        article_id: foundArticle.value?.id ?? null,
        client_id: config.value.clientId,
        pathname: location.value.pathname ?? '',
      })
    }
    show.value = false
  }
})

const isAllowFree = computed(() => !isOverFreeLimit.value || paywall.value.read.includes(currentReadIdentifier.value))
const isScrollOverThreshold = computedEager(() => y.value > height.value * 0.45)

// We need paywall if meet the follow conditions
// 1. current page is article
// 2. user is run out of free read limit and current article is not read before
// 3. user scroll over 40%
// We need to measure scroll top first, or paywall will not appear because of cache in Vue
const isNeedPaywall = computed(() => isScrollOverThreshold.value && isArticle.value && !isAllowFree.value)

whenever(
  // When user scroll over 40% will open paywall
  isNeedPaywall,
  () => {
    // Don't show paywall if user is logged in
    if (paywall.value.token) {
      return
    }

    sendTrack('paywall.display', {
      pathname: location.value.pathname ?? '',
      article_id: foundArticle.value?.id ?? null,
      client_id: config.value.clientId,
    })

    show.value = true
  },
  { immediate: true },
)

// Track scroll over threshold
whenever(
  isScrollOverThreshold,
  () => {
    sendTrack('paywall.reach', {
      pathname: location.value.pathname ?? '',
      article_id: foundArticle.value?.id ?? null,
      client_id: config.value.clientId,
    })
  },
  { immediate: true },
)

onMounted(() => {
  // @ts-expect-error inject global
  window.__spph = reactive({
    _y: y,
    _s: isScrollOverThreshold,
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
    show: (v = true) => (show.value = v),
  })
})
</script>

<template>
  <div>
    <AlertDialog :open="show">
      <AlertDialogContent>
        <VisuallyHidden>
          <!-- for accessibility -->
          <AlertDialogTitle class="invisible">Subscribe</AlertDialogTitle>
        </VisuallyHidden>
        <Card class="w-full pb-4 pt-4" :style="themeConfig">
          <CardContent>
            <div class="flex flex-col items-center gap-1">
              <Avatar class="relative mb-3 mt-2 items-center justify-center p-1" size="md">
                <div class="size-full">
                  <AvatarImage :src="config.logo" />
                </div>
              </Avatar>

              <h3 class="text-center text-lg font-bold">{{ config.title }}</h3>

              <p class="text-balance pb-4 text-center text-sm text-stone-400">
                {{ config.description }}
              </p>

              <!-- email form -->
              <EmailForm v-model:email="emailInput" />
            </div>
          </CardContent>
        </Card>
      </AlertDialogContent>
    </AlertDialog>
  </div>
</template>
