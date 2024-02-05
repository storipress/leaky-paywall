<script setup lang="ts">
import { useForwardPropsEmits } from 'radix-vue'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ 'update:open': [boolean] }>()

const args = useForwardPropsEmits(props, emit)
</script>

<template>
  <Dialog v-bind="args">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>We’ve sent you a login link!</DialogTitle>
        <DialogDescription>If the email doesn't arrive in 3 minutes, check your spam folder.</DialogDescription>
      </DialogHeader>

      <DialogFooter>
        <Button @click="$emit('update:open', false)">OK</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
