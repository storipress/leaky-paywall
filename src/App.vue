<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue'

const route = useRoute()
const target = ref<ComponentPublicInstance | null>(null)
provideRoot(target)

// For dev
setConfig({ all: true })
</script>

<template>
  <ArticleLayout1 :key="route.path" />
  <LeakyPaywall :key="route.path" />
  <LeakyPaywallDebug />
  <SubscriptionForm />
  <PortalTarget ref="target" />
  <Sonner />
  <Teleport to="body">
    <DevPanel />
  </Teleport>
</template>
