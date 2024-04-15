<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Props } from './components/LeakyPaywallContent.vue'

const props = defineProps<{
  color: string
  logo: string
  title: string
  description: string
  dismissible: boolean
}>()

const config = computed((): Props['config'] => ({
  ...props,
  primaryColor: props.color,
}))
const email = ref('')
</script>

<template>
  <LeakyPaywallContent v-model:email="email" :config="config" />
</template>

<style src="./assets/index.css"></style>
