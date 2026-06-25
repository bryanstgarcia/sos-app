import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { tv, type VariantProps } from "tailwind-variants"

// Used internally by shadcn-generated components
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export { tv, type VariantProps }
