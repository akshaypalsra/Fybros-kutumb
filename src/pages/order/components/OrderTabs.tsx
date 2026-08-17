import { Tabs, TabsList, TabsTrigger } from "@/common/components/ui/tabs"
import type { TabFilter } from "@/types/order.types"


interface OrderTabsProps {
  value: TabFilter
  onChange: (value: TabFilter) => void
  allCount: number
  openCount: number
  closedCount: number
}

export const OrderTabs = ({ value, onChange, allCount, openCount, closedCount }: OrderTabsProps) => (
  <div className="mb-4 flex items-center justify-between">
    <Tabs value={value} onValueChange={(v) => onChange(v as TabFilter)}>
      <TabsList className="gap-1 rounded-lg border border-border bg-card p-1">
        <TabsTrigger
          value="ALL"
          className="rounded-md px-4 py-1.5 text-[13px] font-semibold data-[state=active]:bg-secondary data-[state=active]:text-white"
        >
          All ({allCount})
        </TabsTrigger>
        <TabsTrigger
          value="OPEN"
          className="rounded-md px-4 py-1.5 text-[13px] font-semibold data-[state=active]:bg-secondary data-[state=active]:text-white"
        >
          Open ({openCount})
        </TabsTrigger>
        <TabsTrigger
          value="CLOSED"
          className="rounded-md px-4 py-1.5 text-[13px] font-semibold data-[state=active]:bg-secondary data-[state=active]:text-white"
        >
          Closed ({closedCount})
        </TabsTrigger>
      </TabsList>
    </Tabs>
  </div>
)