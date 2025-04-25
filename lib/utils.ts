import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

export function formatAmount(amount: number): string {
  return amount.toFixed(8)
}

export function shortenAddress(address: string, chars = 4): string {
  if (!address) return ""
  return `${address.substring(0, chars)}...${address.substring(address.length - chars)}`
}
