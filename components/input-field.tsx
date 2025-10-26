"use client"

import type { ReactNode } from "react"

interface InputFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  type?: string
  icon?: ReactNode
  error?: string
  hint?: string
  disabled?: boolean
}

export function InputField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  icon,
  error,
  hint,
  disabled = false,
}: InputFieldProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full px-4 py-4 border border-gray-300 rounded-xl bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
        />
        {icon && <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">{icon}</div>}
      </div>
      {hint && <p className="text-xs text-orange-500">{hint}</p>}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
