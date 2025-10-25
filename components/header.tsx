"use client"

import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

interface HeaderProps {
  title: string
  showBack?: boolean
}

export function Header({ title, showBack = false }: HeaderProps) {
  const router = useRouter()

  return (
    <header className="sticky top-0 z-50 bg-(--color-surface) border-b border-(--color-border) px-4 py-4">
      <div className="flex items-center gap-3">
        {showBack && (
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-(--color-background) rounded-lg transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-(--color-text)" />
          </button>
        )}
        <h1 className="text-xl font-semibold text-(--color-text)">{title}</h1>
      </div>
    </header>
  )
}
