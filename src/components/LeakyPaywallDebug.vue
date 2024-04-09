<script setup lang="ts">
import { useDebugInfo } from '~/utils/debug-info'

const { isLoading, state: debugInfo } = useDebugInfo()

const hasArticle = computed(() => !!debugInfo.value._a)
</script>

<template>
  <div class="fixed right-0 top-0 z-[99999] bg-white p-1 text-sm shadow-lg">
    <h3 class="text-bold text-lg">Storipress Prophet</h3>
    <div v-if="isLoading && !debugInfo">Connecting to Prophet...</div>
    <template v-else>
      <div>Found version: {{ debugInfo._z }}</div>
      <Button size="sm" @click="debugInfo.show()">Test</Button>
      <details>
        <summary>Debug Info</summary>
        <div>
          <div>
            Article
            <span :class="hasArticle ? 'text-green-500' : 'text-red-500'">{{
              hasArticle ? 'found' : 'not found'
            }}</span>
          </div>
          <div>Read articles/limit {{ debugInfo._p.read.length }}/{{ debugInfo._c.freeLimit }}</div>
        </div>
      </details>
    </template>
  </div>
</template>
