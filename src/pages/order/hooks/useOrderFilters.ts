import type { Order, TabFilter } from "@/types/order.types"
import { useMemo } from "react"
import { formatMonth } from "@/utils/orders.utils"

export const useOrderFilters = (orders: Order[] | undefined, tab: TabFilter) => {
  const filteredOrders = useMemo(() => {
    let list = orders ?? []

    if (tab === "OPEN") list = list.filter((o) => o.orderStatus === "OPEN")
    if (tab === "CLOSED") list = list.filter((o) => o.orderStatus !== "OPEN")

    return list
  }, [orders, tab])

  const groupedByMonth = useMemo(() => {
    const groups = new Map<string, Order[]>()
    for (const order of filteredOrders) {
      const key = formatMonth(order.docDate)
      if (!groups.has(key)) groups.set(key, [])
      groups.get(key)!.push(order)
    }
    return Array.from(groups.entries())
  }, [filteredOrders])

  return {
    filteredOrders,
    groupedByMonth,
  }
}