import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

/**
 * The app's button (misty/src/shared/ui/controls/Button.tsx), under the shadcn names the site
 * already uses:
 *   default → primary: the one filled call to action on a surface, cream on charcoal
 *   outline, secondary → secondary: the bordered everyday button
 *   ghost → quiet: a wash on hover and nothing else, for bars and inline actions
 *   destructive → danger: only for what deletes
 * Heights follow the app's control frame: xs 24, sm and default 32, lg 36 (a page's one call to
 * action). Corners come from the frame too; pages never round a button themselves.
 * Keyboard focus shows as the hover fill, as in the app.
 */
const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center border border-transparent bg-clip-padding text-control font-medium whitespace-nowrap outline-none select-none disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-cream-bright bg-clip-border text-charcoal-bg hover:bg-cream-action-hover focus-visible:bg-cream-action-hover aria-expanded:bg-cream-action-hover data-[state=open]:bg-cream-action-hover",
        outline:
          "border-charcoal-border-strong bg-transparent text-cream hover:border-charcoal-active hover:bg-charcoal-hover hover:text-cream-bright focus-visible:bg-charcoal-hover focus-visible:text-cream-bright aria-expanded:bg-charcoal-hover aria-expanded:text-cream-bright data-[state=open]:bg-charcoal-hover data-[state=open]:text-cream-bright",
        secondary:
          "border-charcoal-border-strong bg-transparent text-cream hover:border-charcoal-active hover:bg-charcoal-hover hover:text-cream-bright focus-visible:bg-charcoal-hover focus-visible:text-cream-bright aria-expanded:bg-charcoal-hover aria-expanded:text-cream-bright data-[state=open]:bg-charcoal-hover data-[state=open]:text-cream-bright",
        ghost:
          "bg-clip-border text-cream-muted hover:bg-control-hover hover:text-cream focus-visible:bg-control-hover focus-visible:text-cream aria-expanded:bg-control-active aria-expanded:text-cream data-[state=open]:bg-control-active data-[state=open]:text-cream",
        destructive:
          "border-charcoal-border-strong bg-transparent text-danger hover:bg-danger-wash focus-visible:bg-danger-wash aria-expanded:bg-danger-wash data-[state=open]:bg-danger-wash",
        link: "text-cream-bright underline-offset-4 hover:underline focus-visible:underline",
      },
      size: {
        default:
          "h-8 gap-1.5 rounded-lg px-3 has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5",
        xs: "h-6 gap-1 rounded-md px-2 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5",
        sm: "h-8 gap-1.5 rounded-lg px-3 has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5",
        lg: "h-9 gap-1.5 rounded-lg px-4 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        icon: "size-8 rounded-lg",
        "icon-xs": "size-6 rounded-md",
        "icon-sm": "size-8 rounded-lg",
        "icon-lg": "size-9 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button,  }
