
interface FulfillmentBarProps {
  delivered: number
  pending: number
  cancelled: number
  total: number
}

export const FulfillmentBar = ({ delivered, pending, cancelled, total }: FulfillmentBarProps) => {
  const safeTotal = total || 1
  const deliveredPct = Math.min(100, Math.round((delivered / safeTotal) * 100))

  return (
    <div>
      <div className="mb-1.5 flex items-center text-[11px] font-medium text-muted-foreground">
        <span>{deliveredPct}%</span>
        <span>&nbsp; Fulfilled</span>
      </div>
      <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div className="h-full bg-emerald-500" style={{ width: `${(delivered / safeTotal) * 100}%` }} />
        <div className="h-full bg-amber-500" style={{ width: `${(pending / safeTotal) * 100}%` }} />
        <div className="h-full bg-red-500" style={{ width: `${(cancelled / safeTotal) * 100}%` }} />
      </div>
      <div className="mt-1.5 flex justify-between gap-3 text-[10.5px] font-normal">
        <span className="text-emerald-600">{delivered} Delivered</span>
        <span className="text-amber-600">{pending} Pending</span>
        <span className="text-red-600">{cancelled} Cancelled</span>
      </div>
    </div>
  )
}