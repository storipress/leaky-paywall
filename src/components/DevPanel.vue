<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { toast } from 'vue-sonner'
import { Field as FormField, useForm } from 'vee-validate'
import { slugifyWithCounter } from '@sindresorhus/slugify'
import { $config, configSchema } from '~/stores/config'

const open = ref(false)
const typedSchema = toTypedSchema(configSchema)
const form = useForm({
  initialValues: $config.get(),
  validationSchema: typedSchema,
})

whenever(open, () => {
  form.setValues($config.get())
})

const onSubmit = form.handleSubmit((values) => {
  // eslint-disable-next-line no-console
  console.log(values)
  $config.set(values)
  open.value = false
})

const { injectScript } = useCreateBookmarklet()
const { copy } = useClipboard({
  source: injectScript,
})

async function copyBookmarklet() {
  await copy()
  toast('Copied!')
}

const slugify = slugifyWithCounter()
const route = useRoute()
const router = useRouter()
function goToArticle() {
  const words = lorem.generateWords(5)
  const slug = slugify(words)
  router.push(`/${slug}`)
}

const paywall = useStore($paywall)

function logout() {
  $paywall.setKey('token', '')
}

function resetRead() {
  $paywall.set({
    ...$paywall.get(),
    read: [],
  })
}
</script>

<template>
  <Popover v-model:open="open">
    <PopoverTrigger class="fixed left-0 top-0 ml-1 mt-1">
      <Button class="bg-teal-500">Dev Config Panel</Button>
    </PopoverTrigger>
    <PopoverContent side="bottom">
      <Card>
        <CardContent>
          <div class="mb-1 flex gap-1">
            <Button :disabled="!paywall.token" @click="logout">Logout</Button>
            <Button @click="resetRead">Reset read</Button>
          </div>
          <Button @click="goToArticle">Go to random article</Button>
          <div>
            <ul>
              <li>Amount of read articles: {{ paywall.read.length }}</li>
              <li>Is current article read before? : {{ paywall.read.includes(route.path) }}</li>
            </ul>
          </div>
          <form class="flex w-full flex-col gap-1" @submit="onSubmit">
            <FormField v-slot="{ componentField }" name="title">
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input v-bind="componentField" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="description">
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea v-bind="componentField" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="avatar">
              <FormItem>
                <FormLabel>Avatar</FormLabel>
                <FormControl>
                  <Input v-bind="componentField" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="publicationLogo">
              <FormItem>
                <FormLabel>Publication Logo</FormLabel>
                <FormControl>
                  <Input v-bind="componentField" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="primaryColor">
              <FormItem>
                <FormLabel>Primary color</FormLabel>
                <FormControl>
                  <input type="color" v-bind="componentField" />
                </FormControl>
                <FormMessage />
                <FormDescription>PS: Color field has a bug cause it can't display the current color</FormDescription>
              </FormItem>
            </FormField>
            <Button type="submit">Update</Button>
          </form>
        </CardContent>
        <CardFooter class="mt-2">
          <Button @click="copyBookmarklet">Copy embed javascript code</Button>
        </CardFooter>
      </Card>
    </PopoverContent>
  </Popover>
</template>
