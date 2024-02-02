<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue'

const target = ref<ComponentPublicInstance | null>(null)
provideRoot(target)
</script>
<template>
  <ArticleLayout1 />
  <LeakyPaywall />
  <PortalTarget ref="target" />
  <Sonner />
  <Teleport to="body">
    <DevPanel />
  </Teleport>
</template>
