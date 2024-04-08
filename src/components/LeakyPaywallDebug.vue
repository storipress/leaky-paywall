<script setup lang="ts">
import { useDebugInfo } from '~/utils/debug-info'

const { isLoading, state: debugInfo } = useDebugInfo()
</script>

<template>
  <div class="fixed right-0 top-0 p-1 text-sm shadow-lg">
    <h3 class="text-bold text-lg">Storipress Prophet</h3>
    <div v-if="isLoading && !debugInfo">Connecting to Prophet...</div>
    <template v-else>
      <div>Found version: {{ debugInfo._z }}</div>
      <Button size="sm" @click="debugInfo.show()">Test</Button>
    </template>
  </div>
</template>
