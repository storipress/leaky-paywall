import { cva } from 'class-variance-authority'

export { default as Avatar } from './Avatar.vue'
export { default as AvatarImage } from './AvatarImage.vue'
export { default as AvatarFallback } from './AvatarFallback.vue'

export const avatarVariant = cva(
  'inline-flex items-center justify-center select-none shrink-0',
  {
    variants: {
      size: {
        sm: 'text-xs',
        base: 'text-2xl',
        md: 'text-5xl',
        lg: 'text-5xl',
      },
      shape: {
        circle: 'rounded-full',
        square: 'rounded-md',
      },
    },
  },
)
