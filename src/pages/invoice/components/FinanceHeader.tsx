import { TABS } from "@/constants/Constants"
import type { Tab } from "@/types/invoice.types"
import { cn } from "@/utils/invoice.utils"
import { Bell } from "lucide-react"


export const FinanceHeader = ({
  partnerName,
  partnerCode,
  activeTab,
  onTabChange,
}: {
  partnerName: string
  partnerCode: string
  activeTab: Tab
  onTabChange: (tab: Tab) => void
}) => (
  <div className="mb-6 flex items-center justify-between">
    <div className="flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary/10 text-lg font-bold text-secondary">
        {partnerName?.[0] ?? "A"}
      </div>
      <div>
        <h1 className="text-lg font-bold leading-tight text-foreground">{partnerName || "Loading..."}</h1>
        <p className="text-xs text-muted-foreground">{partnerCode}</p>
      </div>
    </div>

    <div className="flex items-center gap-6">
      <nav className="flex items-center gap-6 text-sm font-medium">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => onTabChange(tab.key)}
            className={cn(
              "border-b-2 pb-1 transition-colors",
              activeTab === tab.key
                ? "border-secondary text-secondary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
          </button>
        ))}
      </nav>
      <button
        type="button"
        aria-label="Notifications"
        className="relative flex h-10 w-10 items-center justify-center rounded-full border bg-background text-foreground transition-colors hover:bg-muted"
      >
        <Bell className="h-4 w-4" />
        <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-secondary" />
      </button>
    </div>
  </div>
)