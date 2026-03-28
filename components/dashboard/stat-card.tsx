import type { LucideIcon } from "lucide-react"
import { TrendingUp } from "lucide-react"
import { Card } from "@/components/ui/card"

interface StatCardProps {
  title: string
  value: string
  subtitle?: string
  icon: LucideIcon
  trend?: {
    value: string
    label: string
  }
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
}: StatCardProps) {
  return (
    <Card className="gap-4 p-6 bg-white border-border-light h-[170px] shadow-none">
      <div className="flex justify-between items-start">
        <p className="font-medium text-text-tertiary text-sm leading-5">
          {title}
        </p>
        <div className="bg-white rounded-lg size-9 flex items-center justify-center shrink-0">
          <Icon className="size-5 text-brand-primary" />
        </div>
      </div>

      <div className="flex items-baseline gap-2">
        <p className="font-bold text-text-primary text-2xl leading-8">
          {value}
        </p>
        {subtitle && (
          <span className="font-medium text-text-muted text-sm leading-5">
            {subtitle}
          </span>
        )}
      </div>

      {trend && (
        <div className="flex items-center gap-1.5">
          <div className="bg-success-bg rounded-full h-5 px-2 flex items-center gap-1">
            <TrendingUp className="size-3 text-success-text" />
            <span className="font-semibold text-success-text text-xs leading-4">
              {trend.value}
            </span>
          </div>
          <span className="text-text-muted text-xs leading-4">
            {trend.label}
          </span>
        </div>
      )}
    </Card>
  )
}
