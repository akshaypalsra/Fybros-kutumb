import type { TabFilter } from "@/types/order.types"
import { useInfiniteOrders } from "@/pages/order/hooks/useInfiniteOrders"
import { useActiveBusinessPartner } from "@/hooks/useActiveBusinessPartner"

interface UseOrdersDataParams {
  query: string
  dateFrom: string
  dateTo: string
  selectedVerticals: string[]
  tab: TabFilter
}

export const tabToOrderStatus = (tab: TabFilter): string | undefined => {
  if (tab === "OPEN") return "OPEN"
  if (tab === "CLOSED") return "CLOSED"
  return undefined
}

export const useOrdersData = ({ query, dateFrom, dateTo, selectedVerticals, tab }: UseOrdersDataParams) => {
 const { partner, isPartnerLoading, isPartnerError, enabled } = useActiveBusinessPartner()

  const {
    orders,
    isLoading: isOrdersLoading,
    isError: isOrdersError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteOrders(
    {
      businessPartnerId: partner?.cardCode ?? "",
      query: query.trim() || undefined,
      fromDate: dateFrom || undefined,
      toDate: dateTo || undefined,
      verticals: selectedVerticals.length ? selectedVerticals : undefined,
      orderStatus: tabToOrderStatus(tab),
    },
    enabled
  )

  return {
    partner,
    orders,
    isLoading: isPartnerLoading || isOrdersLoading,
    isError: isPartnerError || isOrdersError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  }
}