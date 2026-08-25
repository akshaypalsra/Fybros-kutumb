import { cn } from "@/lib/utils"
import type { AgeingBucketResponse } from "@/types/business-partner.types"
import { formatCompactCurrency } from "@/utils/common.utils"
import { getAgeingColor } from "@/utils/invoice.utils"


export const AgeingBar = ({ buckets }: { buckets: AgeingBucketResponse[] }) => {
  const total = buckets.reduce((sum, b) => sum + b.bucketAmount, 0) || 1;
  return (
    <div>
      <div className="flex h-2.5 w-full overflow-hidden rounded-full">
        {buckets.map((b) => (
          <div
            key={b.ageingBucket}
            className={cn("h-full", getAgeingColor(b.ageingBucket))}
            style={{ width: `${(b.bucketAmount / total) * 100}%` }}
          />
        ))}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-y-3 sm:grid-cols-4">
        {buckets.map((b) => (
          <div key={b.ageingBucket} className="flex items-center gap-2">
            <span className={cn("h-2 w-2 shrink-0 rounded-full", getAgeingColor(b.ageingBucket))} />
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">{b.ageingBucket} days</p>
              <p className="text-sm font-heading text-foreground">{formatCompactCurrency(b.bucketAmount)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}