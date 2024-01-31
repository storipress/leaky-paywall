<script setup lang="ts">
const { content, excerpt, headline, title } = getFakeArticle()
</script>

<template>
  <div class="mx-auto flex max-w-4xl p-5">
    <div class="flex-auto">
      <img :src="headline" />
      <h3 class="mb-2 text-xl font-semibold">{{ title }}</h3>
      <p class="text-md mb-4">{{ excerpt }}</p>
      <div class="text-base text-gray-700">
        {{ content }}
      </div>
    </div>
    <div class="w-1/4 p-4">
      <p class="text-base text-gray-700">Sidebar...</p>
    </div>
  </div>
</template>
