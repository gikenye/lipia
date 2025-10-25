import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function formatCurrency(amount: number, currency = "KES"): string {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
  }).format(amount)
}

export function validatePhoneNumber(phone: string): boolean {
  const phoneRegex = /^(\+254|0)[0-9]{9}$/
  return phoneRegex.test(phone.replace(/\s/g, ""))
}

export function validateAmount(amount: number, min: number, max: number): boolean {
  return amount >= min && amount <= max
}

export function calculateCUSD(kesAmount: number, rate: number): number {
  return kesAmount / rate
}

export function calculateKES(cusdAmount: number, rate: number): number {
  return cusdAmount * rate
}
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
