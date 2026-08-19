import { useQuery } from "@tanstack/react-query"
import { useBusinessPartnerApi } from "@/api/business/useBusinessPartnerApi"
import type { BusinessPartner } from "@/types/businessPartner.types"
import type { TabFilter } from "@/types/order.types"
import { useInfiniteOrders } from "@/pages/order/hooks/useInfiniteOrders"

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
  const { getBusinessPartners } = useBusinessPartnerApi()
  const { data: partner, isLoading: isPartnerLoading, isError: isPartnerError } = useQuery<BusinessPartner>({
    queryKey: ["business-partner"],
    queryFn: () => getBusinessPartners(),
  })

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
    !!partner?.cardCode,
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