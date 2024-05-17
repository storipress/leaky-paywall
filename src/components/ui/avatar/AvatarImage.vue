<script setup lang="ts">
import { AvatarImage, type AvatarImageProps } from 'radix-vue'

const props = defineProps<AvatarImageProps>()
</script>

<template>
  <!-- w-full is required for properly style on Safari -->
  <AvatarImage v-bind="props" class="h-full w-full max-w-32 object-cover md:max-w-48" />
</template>
