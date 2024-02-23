<script setup lang="ts">
import { AvatarImage, type AvatarImageProps } from 'radix-vue'

const props = defineProps<AvatarImageProps>()
</script>

<template>
  <AvatarImage v-bind="props" class="object-cover h-full max-w-32 md:max-w-48" />
</template>
