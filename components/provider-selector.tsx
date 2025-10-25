"use client"

import { Check } from "lucide-react"

interface Provider {
  id: string
  name: string
  logo: string
}

interface ProviderSelectorProps {
  providers: Provider[]
  selected: string
  onSelect: (id: string) => void
}

export function ProviderSelector({ providers, selected, onSelect }: ProviderSelectorProps) {
  return (
    <div className="space-y-3">
      {providers.map((provider) => (
        <button
          key={provider.id}
          onClick={() => onSelect(provider.id)}
          className={`w-full p-4 rounded-lg border-2 transition-all ${
            selected === provider.id
              ? "border-(--color-accent) bg-(--color-background)"
              : "border-(--color-border) bg-(--color-surface) hover:border-(--color-accent)"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{provider.logo}</span>
              <span className="font-medium text-(--color-text)">{provider.name}</span>
            </div>
            {selected === provider.id && <Check className="w-5 h-5 text-(--color-accent)" />}
          </div>
        </button>
      ))}
    </div>
  )
}
