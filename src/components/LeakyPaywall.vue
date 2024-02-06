<script setup lang="ts">
import { sendTrack } from '~/lib/tracking'

const scrollLock = useScrollLock(window)
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

const checkQuery = useQueryAction()

const foundArticle = useFindArticle()

const paywallEnabled = usePaywallEnabled()
const location = useBrowserLocation()
const isArticle = logicAnd(() => config.value.flags.paywall, logicOr(foundArticle, paywallEnabled))

const isOverFreeLimit = computed(() => paywall.value.read.length >= config.value.freeLimit)

watch(
  location,
  (loc) => {
    sendTrack('page', {
      pathname: loc.pathname ?? '',
    })

    if (paywallEnabled.value || foundArticle.value) {
      sendTrack('article_view', {
        pathname: location.value.pathname ?? '',
        clientId: config.value.clientId,
        articleId: foundArticle.value?.id ?? null,
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
    sendTrack('subscriber_sign_in', {
      clientId: config.value.clientId,
      articleId: foundArticle.value?.id ?? null,
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
    sendTrack('article_scroll_back', {
      articleId: foundArticle.value?.id ?? null,
      pathname: location.value.pathname ?? '',
      clientId: config.value.clientId,
    })
    show.value = false
    scrollLock.value = false
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

    sendTrack('paywall_triggered', {
      pathname: location.value.pathname ?? '',
      articleId: foundArticle.value?.id ?? null,
      clientId: config.value.clientId,
      isExceedFreeLimit: true,
    })
    scrollLock.value = true
    show.value = true
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
        <Card class="w-full pb-4 pt-4" :style="themeConfig">
          <CardContent>
            <div class="flex flex-col items-center gap-1">
              <Avatar
                class="relative mb-4 mt-2 items-center justify-center overflow-visible bg-white p-1 shadow-md"
                size="md"
              >
                <div class="size-full overflow-hidden rounded-full">
                  <AvatarImage :src="config.avatar" />
                </div>
                <Avatar
                  shape="square"
                  class="absolute bottom-0 right-0 translate-x-1 translate-y-1 items-center justify-center bg-white p-1 shadow-md"
                  size="sm"
                >
                  <div class="size-full overflow-hidden rounded-md">
                    <AvatarImage :src="config.publicationLogo" />
                  </div>
                </Avatar>
              </Avatar>

              <h3 class="text-center text-lg font-bold">{{ config.title }}</h3>

              <p class="text-balance pb-4 text-center text-sm text-stone-400">
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
