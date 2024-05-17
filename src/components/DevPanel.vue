<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { toast } from 'vue-sonner'
import { Field as FormField, useForm } from 'vee-validate'
import { slugifyWithCounter } from '@sindresorhus/slugify'
import { z } from 'zod'
import { configSchema } from 'shared/schema'
import { $config } from '~/stores/config'

const open = ref(false)
const formSchema = configSchema.omit({ freeLimit: true, paywallTrigger: true }).extend({
  freeLimitQuota: z.coerce.number(),
  freeLimitInterval: z.union([z.literal('inf'), z.coerce.number()]),
  paywallTriggerType: z.enum(['viewport', 'article']),
  paywallTriggerValue: z.number(),
})
const typedSchema = toTypedSchema(formSchema)
const initConfig = $config.get()
const form = useForm({
  initialValues: {
    ...initConfig,
    freeLimitInterval: initConfig.freeLimit.interval,
    freeLimitQuota: initConfig.freeLimit.quota,
    paywallTriggerType: initConfig.paywallTrigger.type,
    paywallTriggerValue: initConfig.paywallTrigger.value,
  },
  validationSchema: typedSchema,
})

whenever(open, () => {
  form.setValues($config.get())
})

const onSubmit = form.handleSubmit((values) => {
  // eslint-disable-next-line no-console
  console.log(values)
  const { freeLimitInterval, freeLimitQuota, paywallTriggerType, paywallTriggerValue, ...rest } = values
  $config.set({
    ...rest,
    freeLimit: {
      quota: freeLimitQuota,
      interval: freeLimitInterval,
    },
    paywallTrigger: {
      type: paywallTriggerType,
      value: paywallTriggerValue,
    },
  })
  open.value = false
})

const { devScript, productionHTML, productionTestScript } = useCreateBookmarklet()
const { copy: copyDevScript } = useClipboard({
  source: devScript,
})

const { copy: copyProductionHTML } = useClipboard({
  source: productionHTML,
})
const { copy: copyProductionTestScript } = useClipboard({
  source: productionTestScript,
})

async function onCopyDevScript() {
  await copyDevScript()
  toast('Copied!')
}

async function onCopyProductionHTML() {
  const all = $config.get().all
  setConfig({ all: false })
  await copyProductionHTML()
  toast('Copied!')
  setConfig({ all })
}

async function onCopyProductionScript() {
  const all = $config.get().all
  setConfig({ all: false })
  await copyProductionTestScript()
  toast('Copied!')
  setConfig({ all })
}

const slugify = slugifyWithCounter()
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
            </ul>
          </div>
          <form class="flex w-full flex-col gap-1" @submit="onSubmit">
            <FormField v-slot="{ componentField }" name="freeLimitQuota">
              <FormItem>
                <FormLabel>Free N article in interval</FormLabel>
                <FormControl>
                  <Input v-bind="componentField" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="freeLimitInterval">
              <FormItem>
                <FormLabel>Days to reset free limit</FormLabel>
                <FormControl>
                  <Input v-bind="componentField" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="paywallTriggerType">
              <FormItem>
                <FormLabel>Paywall trigger type</FormLabel>
                <Select v-bind="componentField">
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Paywall trigger type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="viewport"> Viewport </SelectItem>
                      <SelectItem value="article"> Article </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="paywallTriggerValue">
              <FormItem>
                <FormLabel>Paywall trigger value</FormLabel>
                <FormControl>
                  <Input v-bind="componentField" type="number" step="0.01" />
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
            <FormField v-slot="{ componentField }" name="logo">
              <FormItem>
                <FormLabel>Logo</FormLabel>
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
            <FormField v-slot="{ componentField }" name="all">
              <FormItem>
                <FormLabel>Treat every page as article</FormLabel>
                <FormControl>
                  <Switch
                    v-bind="componentField"
                    :checked="componentField.modelValue"
                    @update:checked="componentField['onUpdate:modelValue']"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="dismissible">
              <FormItem>
                <FormLabel>Allow dismiss paywall</FormLabel>
                <FormControl>
                  <Switch
                    v-bind="componentField"
                    :checked="componentField.modelValue"
                    @update:checked="componentField['onUpdate:modelValue']"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <Button type="submit">Update</Button>
          </form>
        </CardContent>
        <CardFooter class="mt-2 flex h-full flex-col">
          <Button @click="onCopyDevScript">Copy dev javascript</Button>
          <Button @click="onCopyProductionHTML">Copy production html</Button>
          <Button @click="onCopyProductionScript">Copy production javascript</Button>
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
