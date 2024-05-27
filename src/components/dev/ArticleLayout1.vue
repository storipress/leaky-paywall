<script setup lang="ts">
const id = String(Math.ceil(Math.random() * 100))
const config = useStore($config)
const article = computed(() => getFakeArticle(`${config.value.clientId}.${id}`))
</script>

<template>
  <div class="mx-auto max-w-4xl bg-[#eeecdc] p-5">
    <div class="flex w-full justify-center">
      <img :src="article.headline" />
    </div>
    <h1 class="mb-2 py-4 text-2xl font-semibold">{{ article.title }}</h1>
    <p class="text-md mb-4">{{ article.excerpt }}</p>
    <div v-if="config.clientId" class="prose flex flex-col gap-1 text-gray-700" v-html="article.content" />
  </div>
</template>
