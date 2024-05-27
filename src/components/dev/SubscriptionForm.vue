<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { Field as FormField, useForm } from 'vee-validate'
import { useAutoAnimate } from '@formkit/auto-animate/vue'
import * as z from 'zod'

const formSchema = toTypedSchema(
  z.object({
    email: z.string().email(),
  }),
)

const input = ref<HTMLElement>()

const form = useForm({
  validationSchema: formSchema,
  validateOnMount: false,
  initialTouched: { email: false },
})

const onSubmit = form.handleSubmit(async (values) => {
  // eslint-disable-next-line no-console
  console.log('demo form submit', values)
})

const [formItem, setAnimate] = useAutoAnimate({ duration: 200 })

setAnimate(false)

onMounted(async () => {
  form.setFieldTouched('email', false)
  await nextTick()
  setAnimate(true)
})
</script>

<template>
  <div class="container my-2 border p-32 shadow-lg">
    <div>
      <h3 class="text-2xl font-bold">This is a demo form which simulate the subscription form on the website</h3>
      <p>This form should be automatically monitor by Prophet script</p>
    </div>
    <form class="flex w-full flex-col gap-1" @submit="onSubmit">
      <FormField v-slot="{ componentField, meta }" name="email">
        <FormItem ref="formItem">
          <FormControl>
            <Input
              ref="input"
              placeholder="Type your email..."
              autocomplete="email"
              class="mb-2 placeholder:text-gray-400"
              v-bind="componentField"
            />
          </FormControl>
          <FormMessage v-if="meta.touched" />
        </FormItem>
      </FormField>

      <Button type="submit" tabindex="-1" class="w-full">Submit</Button>
    </form>
  </div>
</template>
