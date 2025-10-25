"use client"

import type { ReactNode } from "react"

interface ButtonProps {
  children: ReactNode
  onClick?: () => void
  disabled?: boolean
  variant?: "primary" | "secondary" | "outline"
  size?: "sm" | "md" | "lg"
  fullWidth?: boolean
  type?: "button" | "submit"
  className?: string
}

export function Button({
  children,
  onClick,
  disabled = false,
  variant = "primary",
  size = "md",
  fullWidth = false,
  type = "button",
  className = "",
}: ButtonProps) {
  const baseStyles = "font-medium rounded-full transition-all duration-200 flex items-center justify-center gap-2"

  const variants = {
    primary: "bg-(--color-accent) text-white hover:bg-(--color-accent-light) disabled:bg-(--color-text-secondary)",
    secondary: "bg-(--color-primary) text-white hover:bg-(--color-primary-dark) disabled:bg-(--color-text-secondary)",
    outline:
      "border-2 border-(--color-accent) text-(--color-accent) hover:bg-(--color-background) disabled:border-(--color-text-secondary) disabled:text-(--color-text-secondary)",
  }

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${className || variants[variant]} ${sizes[size]} ${fullWidth ? "w-full" : ""} ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
    >
      {children}
    </button>
  )
}
