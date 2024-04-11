<script setup lang="ts">
import { AlertDialogCancel, type AlertDialogCancelProps } from 'radix-vue'
import type { VariantProps } from 'class-variance-authority'
import { cn } from '~/lib/utils'
import { buttonVariants } from '~/components/ui/button'

interface ButtonVariantProps extends VariantProps<typeof buttonVariants> {}

interface Props {
  variant?: ButtonVariantProps['variant']
  size?: ButtonVariantProps['size']
}

const props = withDefaults(defineProps<AlertDialogCancelProps & Props>(), {
  variant: 'ghost',
  size: 'sm',
})
</script>

<template>
  <AlertDialogCancel v-bind="props" :class="cn(buttonVariants(props), 'mt-2 sm:mt-0', $attrs.class ?? '')">
    <slot />
  </AlertDialogCancel>
</template>
