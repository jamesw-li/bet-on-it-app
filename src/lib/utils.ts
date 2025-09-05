import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export function generateEventCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}

export function calculatePotentialWinnings(betAmount: number, totalPool: number, winningPool: number): number {
  if (winningPool === 0) return betAmount
  return (betAmount / winningPool) * totalPool
}