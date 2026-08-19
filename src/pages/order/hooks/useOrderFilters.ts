import type { Order } from "@/types/order.types"
import { groupByMonth } from "@/utils/grouping.utils"
import { useMemo } from "react"

export const useOrderFilters = (orders: Order[] | undefined) => {
  const groupedByMonth = useMemo(
    () => groupByMonth(orders ?? [], (order) => order.docDate),
    [orders]
  )

  return { groupedByMonth }
}