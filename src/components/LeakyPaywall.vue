<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { Field as FormField, useForm } from 'vee-validate'
import { vAutoAnimate } from '@formkit/auto-animate/vue'
import * as z from 'zod'
import { useStore } from '@nanostores/vue'
import { $config, initConfig } from '~/stores/config'

const scrollLock = useScrollLock(window)
const { y } = useWindowScroll()
const { height } = useWindowSize()
const show = ref(false)

const formSchema = toTypedSchema(
  z.object({
    email: z.string().email(),
  }),
)

const form = useForm({
  validationSchema: formSchema,
  validateOnMount: false,
})

initConfig()

const config = useStore($config)

const mode = ref<'subscribe' | 'signup'>('subscribe')

const primaryButton = computed(() => (mode.value === 'subscribe' ? 'Subscribe' : 'Sign in'))
const secondaryButton = computed(() => (mode.value === 'subscribe' ? 'Sign in' : 'Subscribe'))

const input = ref<HTMLElement>()

const themeConfig = computed(() => ({
  '--sp-primary': config.value.primaryColor,
}))

// TODO: handle submit user email
const onSubmit = form.handleSubmit((values) => {
  // eslint-disable-next-line no-console
  console.log('Form submitted!', values)
})

async function switchMode() {
  // Backup user email
  const email = form.values.email ?? ''

  // After this step, the form will be reset
  mode.value = mode.value === 'subscribe' ? 'signup' : 'subscribe'

  await nextTick()

  // re-focus email input
  unrefElement(input)?.focus()
  form.setValues({ email })
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
    form.resetForm()
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
              <form :key="mode" class="flex w-full flex-col gap-1" @submit="onSubmit">
                <FormField v-slot="{ componentField }" name="email">
                  <FormItem v-auto-animate>
                    <FormControl>
                      <Input
                        ref="input"
                        autofocus
                        placeholder="Type your email..."
                        autocomplete="email"
                        class="mb-2 placeholder:text-gray-400"
                        v-bind="componentField"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>

                <Button type="submit" :autofocus="false" class="w-full bg-sp_primary text-white">
                  {{ primaryButton }}
                </Button>
              </form>

              <Separator class="my-2" />

              <Button class="text-gray-600" :autofocus="false" variant="ghost" @click="switchMode">
                {{ secondaryButton }}
              </Button>
            </div>
          </CardContent>
        </Card>
      </AlertDialogContent>
    </AlertDialog>
  </div>
</template>
