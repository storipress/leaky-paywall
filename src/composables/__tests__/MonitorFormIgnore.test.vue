<script setup lang="ts">
import { useMonitorFormSubmit } from '../monitor-form'

const emit = defineEmits<{
  submit: [SubmitEvent]
  monitor: [string]
}>()

useMonitorFormSubmit((email) => emit('monitor', email))
</script>

<template>
  <form data-sp-ignore-form @submit.prevent="$emit('submit', $event as SubmitEvent)">
    <input type="email" name="email" placeholder="Email" />
    <button type="submit">Submit</button>
  </form>
</template>
