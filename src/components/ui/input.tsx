import { Eye, EyeOff } from "lucide-react"
import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  const [revealed, setRevealed] = React.useState(false)
  const password = type === "password"
  const field = (
    <input
      type={password && revealed ? "text" : type}
      data-slot="input"
      className={cn(
        "h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-2.5 py-1 text-base transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        className,
        password && "pr-10"
      )}
      {...props}
    />
  )
  if (!password) return field
  const Icon = revealed ? EyeOff : Eye
  // A password field carries its own eye, the same as the app's.
  return (
    <div className="relative w-full min-w-0">
      {field}
      <button
        type="button"
        aria-label={revealed ? "Hide password" : "Show password"}
        disabled={props.disabled}
        // Keeps the caret in the field while it switches.
        onMouseDown={(event) => event.preventDefault()}
        onClick={() => setRevealed(!revealed)}
        className="absolute inset-y-0 right-0 flex w-10 items-center justify-center rounded-md text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
      >
        <Icon aria-hidden="true" className="size-4" />
      </button>
    </div>
  )
}

export { Input }
