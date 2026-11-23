import { cx } from "class-variance-authority"
import { extendTailwindMerge } from "tailwind-merge"

const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: ["micro", "caption", "meta", "control", "body", "page", "title", "display"],
    },
  },
})

export function cn(...inputs: Parameters<typeof cx>) {
  return twMerge(cx(inputs))
}
