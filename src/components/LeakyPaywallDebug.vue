<script setup lang="ts">
import { SiteSubscriptionInfo } from 'storipress-client'
import { useDebugInfo } from '~/utils/debug-info'

const { isLoading, state: debugInfo } = useDebugInfo()

const hasArticle = computed(() => !!debugInfo.value._a)
const readInfo = computed(() => {
  if (!debugInfo.value) {
    return ''
  }
  const { _p, _c } = debugInfo.value
  return `${_p.read.length}/${_c.freeLimit.quota}/${_c.freeLimit.interval}`
})

const apiInfo = computedAsync(async () => {
  if (debugInfo.value?._u) {
    const { client } = debugInfo.value._u
    const res = await client.query(SiteSubscriptionInfo, {})
    return res.data?.siteSubscriptionInfo
  }
  return null
})

const isLogin = computed(() => {
  if (!debugInfo.value) {
    return false
  }
  const { _p } = debugInfo.value
  return Boolean(_p.token)
})
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
          <div>
            Is login?
            <span :class="isLogin ? 'text-green-500' : 'text-red-500'">{{ isLogin ? 'yes' : 'no' }}</span>
          </div>
          <div>Read articles/limit/interval {{ readInfo }}</div>
          <div>
            API info:
            <ul class="list-disc pl-4">
              <li>name: {{ apiInfo?.name }}</li>
            </ul>
          </div>
        </div>
      </details>
    </template>
  </div>
</template>
