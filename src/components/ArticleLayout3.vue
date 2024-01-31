<script setup lang="ts">
const { content, excerpt, headline, title } = getFakeArticle()
</script>

<template>
  <div class="mx-auto max-w-sm p-5">
    <div class="overflow-hidden rounded-lg bg-white shadow-lg">
      <div class="p-5">
        <img :src="headline" />
        <h3 class="mb-2 text-xl font-semibold">{{ title }}</h3>
        <p class="text-md mb-4">{{ excerpt }}</p>
        <div class="text-base text-gray-700">
          {{ content }}
        </div>
      </div>
    </div>
  </div>
</template>
