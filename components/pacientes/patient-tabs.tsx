"use client"

import type { LucideIcon } from "lucide-react"

interface Tab {
  id: string
  label: string
  icon: LucideIcon
}

interface PatientTabsProps {
  tabs: Tab[]
  activeTab: string
  onTabChange: (tab: string) => void
}

export function PatientTabs({ tabs, activeTab, onTabChange }: PatientTabsProps) {
  return (
    <div className="flex items-center gap-6 border-b border-border-light overflow-x-auto overflow-y-hidden pb-px [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {tabs.map((tab) => {
        const Icon = tab.icon
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2 text-sm pb-3 px-1 whitespace-nowrap transition-colors ${
              isActive
                ? "text-brand-dark font-semibold border-b-2 border-brand-dark"
                : "text-text-muted font-medium hover:text-text-secondary"
            }`}
          >
            <Icon className="size-[18px]" />
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
