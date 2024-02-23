<script setup lang="ts">
const id = String(Math.ceil(Math.random() * 100))
const config = useStore($config)
const article = computed(() => getFakeArticle(`${config.value.clientId}.${id}`))
</script>

<template>
  <div class="max-w-4xl p-5 mx-auto bg-[#eeecdc]">
    <div class="flex justify-center w-full">
      <img :src="article.headline" />
    </div>
    <h1 class="py-4 mb-2 text-2xl font-semibold">{{ article.title }}</h1>
    <p class="mb-4 text-md">{{ article.excerpt }}</p>
    <div v-if="config.clientId" class="flex flex-col gap-1 prose text-gray-700" v-html="article.content" />
  </div>
</template>
