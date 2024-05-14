<script setup lang="ts">
import type { Config } from '~/stores/config'

export interface Props {
  config: Pick<Config, 'dismissible' | 'logo' | 'primaryColor' | 'title' | 'description'>
}

const props = defineProps<Props>()

defineEmits<{ signedIn: [] }>()

const themeConfig = computed(() => ({ '--sp-primary': props.config.primaryColor }))
const email = defineModel('email', {
  default: '',
  required: true,
})
</script>

<template>
  <Card class="w-full pb-4 pt-4" :style="themeConfig">
    <CardContent>
      <div v-if="config.dismissible" class="flex justify-end">
        <AlertDialogClose><span class="i-lucide-x" /></AlertDialogClose>
      </div>
      <div class="flex flex-col items-center gap-1">
        <Avatar class="relative mb-3 mt-2 items-center justify-center p-1" size="md">
          <div class="size-full">
            <AvatarImage :src="config.logo" />
          </div>
        </Avatar>

        <h3 class="text-center text-lg font-bold">{{ config.title }}</h3>

        <p class="text-balance pb-4 text-center text-sm text-stone-400">
          {{ config.description }}
        </p>

        <!-- email form -->
        <EmailForm v-model:email="email" @signed-in="$emit('signedIn')" />
      </div>
    </CardContent>
  </Card>
</template>
