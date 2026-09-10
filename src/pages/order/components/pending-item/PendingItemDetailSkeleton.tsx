const PendingItemDetailSkeleton = ({ rows = 5 }: { rows?: number }) => (
  <div className="overflow-hidden rounded-lg border border-border">
    <table className="w-full border-collapse">
      <thead>
        <tr className="bg-muted/50">
          <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Sales order</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Date</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Total</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Pending</th>
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: rows }).map((_, i) => (
          <tr key={i} className="border-t border-border">
            <td className="px-6 py-4">
              <div className="h-4 w-28 animate-pulse rounded bg-muted" />
            </td>
            <td className="px-6 py-4">
              <div className="h-4 w-20 animate-pulse rounded bg-muted" />
            </td>
            <td className="px-6 py-4">
              <div className="h-4 w-16 animate-pulse rounded bg-muted" />
            </td>
            <td className="px-6 py-4">
              <div className="h-4 w-16 animate-pulse rounded bg-muted" />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

export default PendingItemDetailSkeleton;