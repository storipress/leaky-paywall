<script setup lang="ts">
import { sendTrack } from '~/lib/tracking'

const { y } = useWindowScroll()
const { height } = useWindowSize()
const show = ref(false)

initConfig()

const config = useStore($config)
const paywall = useStore($paywall)

const { mode, primaryButton, reset, secondaryButton, toggleMode } = usePaywallMode()

const themeConfig = computed(() => ({
  '--sp-primary': config.value.primaryColor,
}))

useTrackManager()
const checkQuery = useQueryAction()

const foundArticle = useFindArticle()

const paywallEnabled = usePaywallEnabled()
const location = useBrowserLocation()
const isArticle = logicAnd(() => config.value.flags.paywall, logicOr(foundArticle, paywallEnabled))

const isOverFreeLimit = computed(() => paywall.value.read.length >= config.value.freeLimit)

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
    pushRead(loc.pathname ?? '')
  },
  { immediate: true },
)

onMounted(async () => {
  const res = await checkQuery()
  if (!res) {
    return
  }
  if (res.result && res.action === SIGN_IN) {
    sendTrack('user.sign_in', {
      client_id: config.value.clientId,
      article_id: foundArticle.value?.id ?? null,
      pathname: window.location.pathname,
    })
  }
})

const emailInput = ref('')

function switchMode() {
  // After this step, the form will be reset
  toggleMode()
}

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

const isAllowFree = computed(() => !isOverFreeLimit.value || paywall.value.read.includes(location.value.pathname ?? ''))
const isScrollOverThreshold = computedEager(() => y.value > height.value * 0.4)

// We need paywall if meet the follow conditions
// 1. current page is article
// 2. user is run out of free read limit and current article is not read before
// 3. user scroll over 40%
// We need to measure scroll top first, or paywall will not appear because of cache in Vue
const isNeedPaywall = computed(() => isScrollOverThreshold.value && isArticle.value && !isAllowFree.value)

whenever(
  // When user scroll over 40% will open paywall
  isNeedPaywall,
  async () => {
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

// reset form content after close
whenever(
  logicNot(show),
  () => {
    reset()
  },
  { flush: 'post' },
)
</script>

<template>
  <div>
    <AlertDialog :open="show">
      <VisuallyHidden>
        <!-- for accessibility -->
        <AlertDialogTitle class="invisible">Subscribe</AlertDialogTitle>
      </VisuallyHidden>
      <AlertDialogContent>
        <Card class="w-full pt-4 pb-4" :style="themeConfig">
          <CardContent>
            <div class="flex flex-col items-center gap-1">
              <Avatar
                class="relative items-center justify-center p-1 mt-2 mb-4"
                size="md"
              >
                <div class="size-full">
                  <AvatarImage :src="config.avatar" />
                </div>
              </Avatar>

              <h3 class="text-lg font-bold text-center">{{ config.title }}</h3>

              <p class="pb-4 text-sm text-center text-balance text-stone-400">
                {{ config.description }}
              </p>

              <!-- email form -->
              <EmailForm :key="mode" v-model:email="emailInput" :mode="mode" :button-text="primaryButton" />

              <Separator class="my-2" />

              <Button class="text-gray-600" tabindex="-1" variant="ghost" @click="switchMode">
                {{ secondaryButton }}
              </Button>
            </div>
          </CardContent>
        </Card>
      </AlertDialogContent>
    </AlertDialog>
  </div>
</template>
