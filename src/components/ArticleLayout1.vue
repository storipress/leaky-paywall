<script setup lang="ts">
const { content, excerpt, headline, title } = getFakeArticle()
const config = useStore($config)
const id = String(Math.ceil(Math.random() * 100))
</script>

<template>
  <div class="mx-auto max-w-4xl p-5">
    <div class="flex w-full justify-center">
      <img :src="headline" />
    </div>
    <h1 class="mb-2 py-4 text-2xl font-semibold">{{ title }}</h1>
    <p class="text-md mb-4">{{ excerpt }}</p>
    <div class="flex flex-col gap-1 text-gray-700" :data-sp-article="`${config.clientId}.${id}`" v-html="content" />
  </div>
</template>
