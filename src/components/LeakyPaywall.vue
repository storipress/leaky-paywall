<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { Field as FormField, useForm } from 'vee-validate'
import { vAutoAnimate } from '@formkit/auto-animate/vue'
import * as z from 'zod'

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
})

const onSubmit = form.handleSubmit((values) => {
  console.log('Form submitted!', values)
})

useEventListener(window, 'wheel', (event) => {
  if (event.deltaY <= -5) {
    show.value = false
    scrollLock.value = false
  }
})

whenever(
  () => y.value > height.value * 0.4,
  () => {
    scrollLock.value = true
    show.value = true
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
        <Card class="max-w-md py-4">
          <CardContent>
            <div class="flex flex-col items-center gap-1">
              <Avatar
                class="relative mb-4 mt-2 items-center justify-center overflow-visible bg-white p-1 shadow-md"
                size="md"
              >
                <div class="size-full overflow-hidden rounded-full">
                  <AvatarImage src="https://i.pravatar.cc/300?img=3" />
                </div>
                <Avatar
                  shape="square"
                  class="absolute bottom-0 right-0 translate-x-1 translate-y-1 items-center justify-center bg-white p-1 shadow-md"
                  size="sm"
                >
                  <div class="size-full overflow-hidden rounded-md">
                    <AvatarImage src="https://i.pravatar.cc/300?img=5" />
                  </div>
                </Avatar>
              </Avatar>
              <h3 class="text-lg font-bold">Discover more from AI Supremacy</h3>
              <p class="text-balance text-center text-gray-400">
                News at the intersection of Artificial Intelligence, technology and business including Op-Eds, research
                summaries, guest contributions and valuable info about A.I. startups.
              </p>
              <form class="flex w-full flex-col gap-1" @submit="onSubmit">
                <FormField v-slot="{ componentField }" name="email">
                  <FormItem v-auto-animate>
                    <FormControl>
                      <Input
                        placeholder="Type your email..."
                        class="mb-2 placeholder:text-gray-400"
                        v-bind="componentField"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
                <Button type="submit" class="w-full bg-blue-700 text-white">Subscribe</Button>
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
