<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { Field as FormField, useForm } from 'vee-validate'
import { useAutoAnimate } from '@formkit/auto-animate/vue'
import * as z from 'zod'
import { useModel } from 'vue'

const props = defineProps<{
  email: string
  buttonText: string
}>()

defineEmits<{
  'update:email': [string]
}>()

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
  initialValues: {
    email: props.email ?? '',
  },
})

const emailInput = useModel(props, 'email')

// TODO: handle submit user email
const onSubmit = form.handleSubmit((values) => {
  // eslint-disable-next-line no-console
  console.log('Form submitted!', values)
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
  <form class="flex w-full flex-col gap-1" @submit="onSubmit">
    <FormField v-slot="{ componentField, meta }" name="email">
      <FormItem ref="formItem">
        <FormControl>
          <Input
            ref="input"
            v-model="emailInput"
            autofocus
            placeholder="Type your email..."
            autocomplete="email"
            class="mb-2 placeholder:text-gray-400"
            v-bind="componentField"
          />
        </FormControl>
        <FormMessage v-if="(console.log(meta), meta.touched)" />
      </FormItem>
    </FormField>

    <Button type="submit" tabindex="-1" class="w-full bg-sp_primary text-white">
      {{ buttonText }}
    </Button>
  </form>
</template>
