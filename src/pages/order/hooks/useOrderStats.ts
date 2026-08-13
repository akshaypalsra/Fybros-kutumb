
import type { Order, OrderStats } from "@/types/order.types"
import { useMemo } from "react"


export const useOrderStats = (orders: Order[] | undefined): OrderStats => {
  const openCount = useMemo(
    () => orders?.filter((o) => o.orderStatus === "OPEN").length ?? 0,
    [orders]
  )
  const closedCount = useMemo(
    () => orders?.filter((o) => o.orderStatus !== "OPEN").length ?? 0,
    [orders]
  )
  const totalOrderValue = useMemo(
    () => orders?.reduce((sum, o) => sum + (o.docTotal || 0), 0) ?? 0,
    [orders]
  )
  const openOrderValue = useMemo(
    () => orders?.reduce((sum, o) => sum + (o.openOrderValue || 0), 0) ?? 0,
    [orders]
  )
  const deliveredOrderValue = useMemo(
    () => orders?.reduce((sum, o) => sum + (o.deliveredOrderValue || 0), 0) ?? 0,
    [orders]
  )
  const fillRate = useMemo(() => {
    if (!orders?.length) return 0
    const totalQty = orders.reduce((sum, o) => sum + (o.totalQuantity || 0), 0)
    const deliveredQty = orders.reduce((sum, o) => sum + (o.deliveredQuantity || 0), 0)
    return totalQty ? Math.round((deliveredQty / totalQty) * 100) : 0
  }, [orders])

  const avgOrderSize = orders?.length ? totalOrderValue / orders.length : 0

  return { openCount, closedCount, totalOrderValue, openOrderValue, deliveredOrderValue, fillRate, avgOrderSize }
}