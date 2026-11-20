import { cx } from "class-variance-authority"
import { extendTailwindMerge } from "tailwind-merge"

// The app's type roles (@misty/ui/styles.css). They are font sizes, not text colors: without
// this, `cn("text-control", "text-cream")` would drop the size as a conflicting color.
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
