"use client"

import { AlertCircle } from "lucide-react"

interface WarningMessageProps {
  message: string
  type?: "warning" | "error" | "info"
}

export function WarningMessage({ message, type = "warning" }: WarningMessageProps) {
  const colors = {
    warning: "bg-(--color-warning) bg-opacity-10 text-(--color-warning) border-(--color-warning)",
    error: "bg-(--color-error) bg-opacity-10 text-(--color-error) border-(--color-error)",
    info: "bg-(--color-accent) bg-opacity-10 text-(--color-accent) border-(--color-accent)",
  }

  return (
    <div className={`flex items-start gap-3 p-3 rounded-lg border ${colors[type]}`}>
      <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
      <p className="text-sm">{message}</p>
    </div>
  )
}
