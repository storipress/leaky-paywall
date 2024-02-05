<script setup lang="ts">
import {  cacheExchange, fetchExchange, provideClient } from '@urql/vue'

const target = ref<ComponentPublicInstance | null>(null)
provideRoot(target)

provideClient({
  url: `https://api.storipress.dev/${window.SP_PAYWALL.clientId}/graphql`,
  exchanges: [cacheExchange, fetchExchange],
})
</script>
<template>
  <div>
    <LeakyPaywall />
    <PortalTarget ref="target" />
  </div>
</template>

<style src="./assets/index.css"></style>
