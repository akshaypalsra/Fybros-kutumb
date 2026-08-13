import { useQuery } from "@tanstack/react-query"
import { useOrderApi } from "@/api/order/useOrderApi"
import { useBusinessPartnerApi } from "@/api/business/useBusinessPartnerApi"
import type { Order } from "@/types/order.types"

interface UseOrdersDataParams {
  query: string
  dateFrom: string
  dateTo: string
  selectedVerticals: string[]
  page?: number
  size?: number
}

export const useOrdersData = ({
  query,
  dateFrom,
  dateTo,
  selectedVerticals,
  page = 0,
  size = 20,
}: UseOrdersDataParams) => {
  const { getBusinessPartners } = useBusinessPartnerApi()
  const { searchOrders } = useOrderApi()

  const { data: partner, isLoading: isPartnerLoading } = useQuery({
    queryKey: ["business-partner"],
    queryFn: () => getBusinessPartners(),
  })

  const businessPartnerId = partner?.cardCode ?? ""

  const {
    data: orders,
    isLoading: isOrdersLoading,
    isError,
  } = useQuery<Order[]>({
    queryKey: ["orders", businessPartnerId, query, dateFrom, dateTo, selectedVerticals, page, size],
    queryFn: () =>
      searchOrders({
        businessPartnerId,
        query,
        fromDate: dateFrom || undefined,
        toDate: dateTo || undefined,
        verticals: selectedVerticals.length > 0 ? selectedVerticals : undefined,
        page,
        size,
      }),
    enabled: !!businessPartnerId,
  })

  return {
    partner,
    orders,
    isLoading: isPartnerLoading || isOrdersLoading,
    isError,
  }
}