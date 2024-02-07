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

const events = computed(() => paywall.value.records)

function logout() {
  $paywall.setKey('token', '')
}

function resetRead() {
  $paywall.set({
    ...$paywall.get(),
    read: [],
  })
}
function resetEvents() {
  $paywall.setKey('records', [])
}
</script>

<template>
  <Sheet v-model:open="open">
    <SheetTrigger class="fixed left-0 top-0 z-50 ml-1 mt-1">
      <Button class="pointer-events-auto bg-teal-500">Dev Config Panel</Button>
    </SheetTrigger>
    <SheetContent class="flex h-full flex-col p-2" side="left">
      <Card class="flex h-full flex-col pt-2">
        <CardContent>
          <div class="mb-1 flex gap-1">
            <Button :disabled="!paywall.token" @click="logout">Logout</Button>
            <Button @click="resetRead">Reset read</Button>
            <Button @click="resetEvents">Reset tracking</Button>
          </div>
          <Button @click="goToArticle">Go to random article</Button>
          <div>
            <ul>
              <li>Amount of read articles: {{ paywall.read.length }}</li>
              <li>Is current article read before? : {{ paywall.read.includes(route.path) }}</li>
            </ul>
          </div>
          <form class="flex w-full flex-col gap-1" @submit="onSubmit">
            <FormField v-slot="{ componentField }" name="freeLimit">
              <FormItem>
                <FormLabel>Free limit</FormLabel>
                <FormControl>
                  <Input v-bind="componentField" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
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
        <CardFooter class="mt-2 flex h-full flex-col">
          <Button @click="copyBookmarklet">Copy embed javascript code</Button>
          <ScrollArea class="flex size-full">
            <ul class="w-full">
              <li v-for="(item, index) of events" :key="index" class="w-full text-wrap">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger class="text-left">
                      <p>{{ item.e }}: {{ JSON.stringify(item.p) }}</p>
                    </TooltipTrigger>
                    <TooltipContent>
                      {{ JSON.stringify(item.p) }}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </li>
            </ul>
            <ScrollBar orientation="vertical" />
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </CardFooter>
      </Card>
    </SheetContent>
  </Sheet>
</template>
