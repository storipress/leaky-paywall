<script setup lang="ts">
import { useStore } from '@nanostores/vue'
import { $config, initConfig } from '~/stores/config'

const scrollLock = useScrollLock(window)
const { y } = useWindowScroll()
const { height } = useWindowSize()
const show = ref(false)

initConfig()

const config = useStore($config)

const mode = ref<'subscribe' | 'signup'>('subscribe')

const primaryButton = computed(() => (mode.value === 'subscribe' ? 'Subscribe' : 'Sign in'))
const secondaryButton = computed(() => (mode.value === 'subscribe' ? 'Sign in' : 'Subscribe'))

const themeConfig = computed(() => ({
  '--sp-primary': config.value.primaryColor,
}))

const emailInput = ref('')

function switchMode() {
  // After this step, the form will be reset
  mode.value = mode.value === 'subscribe' ? 'signup' : 'subscribe'
}

// Unlock scroll if user scroll up
useEventListener(window, 'wheel', (event) => {
  if (event.deltaY <= -5) {
    show.value = false
    scrollLock.value = false
  }
})

const { idle } = useIdle(1000, {
  events: ['mousedown', 'resize', 'keydown', 'wheel'],
})

const everIdle = ref(false)

// Detect whenever user idle over 1s
whenever(idle, () => {
  everIdle.value = true
})

// If user scroll over 40%, we will need paywall
const isNeedPaywall = computed(() => y.value > height.value * 0.4)

whenever(
  // Only if user idle, and over 40% will open paywall
  logicAnd(everIdle, isNeedPaywall),
  async () => {
    scrollLock.value = true
    show.value = true
  },
  { immediate: true },
)

// reset form content after close
whenever(
  logicNot(show),
  () => {
    mode.value = 'subscribe'
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
              <EmailForm :key="mode" v-model:email="emailInput" :button-text="primaryButton" />

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
