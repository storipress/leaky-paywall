<script setup lang="ts">
const target = ref<ComponentPublicInstance | null>(null)
provideRoot(target)
</script>
<template>
  <div>
    <LeakyPaywall />
    <PortalTarget ref="target" />
  </div>
</template>

<style src="./assets/index.css"></style>
