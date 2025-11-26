import * as React from "react"
import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  children?: ReactNode
  className?: string
}

export function EmptyState({ icon, title, description, children, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "glass-card rounded-2xl px-6 py-10 sm:px-10 sm:py-12 text-center flex flex-col items-center justify-center",
        className,
      )}
    >
      {icon && (
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
          {icon}
        </div>
      )}
      <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2">{title}</h2>
      {description && (
        <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto mb-4 sm:mb-6">{description}</p>
      )}
      {children && <div className="flex flex-col sm:flex-row gap-3 justify-center w-full sm:w-auto">{children}</div>}
    </div>
  )
}
