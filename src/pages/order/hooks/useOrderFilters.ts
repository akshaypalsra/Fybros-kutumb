import type { Order } from "@/types/order.types"
import { useMemo } from "react"
import { formatMonth } from "@/utils/orders.utils"

export const useOrderFilters = (orders: Order[] | undefined) => {
  const groupedByMonth = useMemo(() => {
    const groups = new Map<string, Order[]>()
    for (const order of orders ?? []) {
      const key = formatMonth(order.docDate)
      if (!groups.has(key)) groups.set(key, [])
      groups.get(key)!.push(order)
    }
    return Array.from(groups.entries())
  }, [orders])

  return { groupedByMonth }
}