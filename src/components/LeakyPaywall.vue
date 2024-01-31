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

const themeConfig = computed(() => ({
  '--sp-primary': config.value.primaryColor,
}))

// TODO: handle submit user email
const onSubmit = form.handleSubmit((values) => {
  // eslint-disable-next-line no-console
  console.log('Form submitted!', values)
})

// Unlock scroll if user scroll up
useEventListener(window, 'wheel', (event) => {
  if (event.deltaY <= -5) {
    show.value = false
    scrollLock.value = false
  }
})

// If user scroll over 40%, open the paywall
whenever(
  () => y.value > height.value * 0.4,
  () => {
    scrollLock.value = true
    show.value = true
    form.resetForm()
  },
)
</script>

<template>
  <div>
    <AlertDialog :open="show">
      <VisuallyHidden>
        <AlertDialogTitle class="invisible">Subscribe</AlertDialogTitle>
      </VisuallyHidden>
      <AlertDialogContent>
        <Card class="max-w-md py-4" :style="themeConfig">
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
              <h3 class="text-lg font-bold">{{ config.title }}</h3>
              <p class="text-balance text-center text-gray-400">
                {{ config.description }}
              </p>
              <form class="flex w-full flex-col gap-1" @submit="onSubmit">
                <FormField v-slot="{ componentField }" name="email">
                  <FormItem v-auto-animate>
                    <FormControl>
                      <Input
                        autofocus
                        placeholder="Type your email..."
                        class="mb-2 placeholder:text-gray-400"
                        v-bind="componentField"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
                <Button type="submit" class="bg-sp_primary w-full text-white">Subscribe</Button>
                <Separator class="my-2" />
                <Button type="submit" class="text-gray-600" variant="ghost">Sign in</Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </AlertDialogContent>
    </AlertDialog>
  </div>
</template>
