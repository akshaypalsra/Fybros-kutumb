import type { ReactNode } from "react"

export const StatCard = ({
  icon,
  label,
  value,
  sublabel,
}: {
  icon: ReactNode
  label: string
  value: string
  sublabel: string
}) => (
  <div className="rounded-2xl bg-secondary p-5 text-white shadow-sm">
    <div className="mb-4 flex items-start justify-between">
      <p className="text-sm font-medium text-white/90">{label}</p>
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">{icon}</div>
    </div>
    <p className="mb-1 text-2xl font-bold">{value}</p>
    <p className="text-xs text-white/80">{sublabel}</p>
  </div>
)