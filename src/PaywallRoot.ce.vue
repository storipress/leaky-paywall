<script setup lang="ts">
import { provideClient } from '@urql/vue'

const target = ref<ComponentPublicInstance | null>(null)
provideRoot(target)

provideClient(createClientOptions(window.SP_PAYWALL.clientId))
</script>
<template>
  <div>
    <LeakyPaywall />
    <PortalTarget ref="target" />
  </div>
</template>

<style src="./assets/index.css"></style>
