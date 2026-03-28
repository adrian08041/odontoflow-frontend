"use client"

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import type { WeeklyChartBar } from "@/lib/types"

const BAR_COLORS: Record<WeeklyChartBar["variant"], string> = {
  primary: "bg-brand-primary",
  dark: "bg-brand-dark",
  accent: "bg-warning-accent",
}

const Y_AXIS_LABELS = [20, 15, 10, 5, 0]

interface WeeklyChartProps {
  title: string
  subtitle: string
  bars: WeeklyChartBar[]
}

export function WeeklyChart({ title, subtitle, bars }: WeeklyChartProps) {
  const barWidth = 12
  const totalBars = bars.length
  const spacing = (100 - barWidth * totalBars) / (totalBars + 1)

  return (
    <Card className="gap-8 p-6 bg-white border-border-light shadow-sm h-[410px] flex flex-col">
      <CardHeader className="p-0 flex-row items-start justify-between">
        <div className="flex flex-col gap-1">
          <CardTitle className="text-text-primary text-lg leading-7">
            {title}
          </CardTitle>
          <CardDescription className="text-text-tertiary text-xs leading-4">
            {subtitle}
          </CardDescription>
        </div>
        <select className="bg-white border border-border-light rounded-md h-[29px] w-[152px] text-sm text-text-tertiary px-2 outline-none font-medium cursor-pointer">
          <option>Esta Semana</option>
          <option>Semana Passada</option>
        </select>
      </CardHeader>

      <div className="relative w-full flex-1 min-h-[200px]">
        <div className="absolute inset-0 right-10 bottom-[30px]">
          {bars.map((bar, index) => (
            <div
              key={bar.label}
              className={`absolute w-[12%] bottom-0 rounded-t ${BAR_COLORS[bar.variant]}`}
              style={{
                height: `${bar.percentage}%`,
                left: `${spacing + index * (barWidth + spacing)}%`,
              }}
            />
          ))}

          <div className="absolute inset-0 pointer-events-none flex flex-col justify-between">
            {Y_AXIS_LABELS.map((label) => (
              <div
                key={label}
                className="w-full border-b border-border-light border-dashed"
              />
            ))}
          </div>
        </div>

        <div className="absolute right-0 top-0 bottom-[30px] w-[35px] flex flex-col justify-between items-end text-text-muted text-xs">
          {Y_AXIS_LABELS.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>

        <div className="absolute left-0 right-10 bottom-0 h-6 flex justify-around items-center text-text-muted text-xs">
          {bars.map((bar) => (
            <span key={bar.label}>{bar.label}</span>
          ))}
        </div>
      </div>
    </Card>
  )
}
