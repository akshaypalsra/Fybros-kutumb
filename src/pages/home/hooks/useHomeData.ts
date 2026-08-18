// pages/home/hooks/useHomeData.ts
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useOrderApi } from "@/api/order/useOrderApi";
import { useBusinessPartnerApi } from "@/api/business/useBusinessPartnerApi";

import type { OrderValue } from "@/types/order.types";
import type { BusinessPartner, OutstandingSummary } from "@/types/businessPartner.types";
import type { InvoiceAnalyticsPoint, InvoiceAnalyticsType } from "@/api/invoice/invoiceApi";
import { useInvoiceApi } from "@/api/invoice/useInvoiceApi";

interface SalesTrendPoint {
  month: string;
  value: number;
}

interface SalesTrend {
  points: SalesTrendPoint[];
  bookedLastMonth: number;
  growthPercent: number;
}

interface UseHomeDataParams {
  salesRange: "MoM" | "QoQ";
}

const RANGE_TO_ANALYTICS_TYPE: Record<"MoM" | "QoQ", InvoiceAnalyticsType> = {
  MoM: "MONTH_OVER_MONTH",
  QoQ: "QUARTER_OVER_QUARTER",
};

function toSalesTrend(points: InvoiceAnalyticsPoint[]): SalesTrend {
  const mapped = points.map((p) => ({ month: p.label, value: p.amount }));
  const last = mapped.at(-1);
  const prev = mapped.at(-2);

  const bookedLastMonth = last?.value ?? 0;
  const growthPercent =
    prev && prev.value !== 0 ? Math.round(((bookedLastMonth - prev.value) / prev.value) * 100) : 0;

  return { points: mapped, bookedLastMonth, growthPercent };
}

export function useHomeData({ salesRange }: UseHomeDataParams) {
  const { getBusinessPartners, getOutstandingSummary } = useBusinessPartnerApi();
  const { getOrderValue } = useOrderApi();
  const { getInvoiceAnalytics } = useInvoiceApi();

  const {
    data: partner,
    isLoading: isPartnerLoading,
    isError: isPartnerError,
  } = useQuery<BusinessPartner>({
    queryKey: ["business-partner"],
    queryFn: () => getBusinessPartners(),
  });

  const cardCode = partner?.cardCode;

  const {
    data: outstandingSummary,
    isLoading: isOutstandingLoading,
    isError: isOutstandingError,
  } = useQuery<OutstandingSummary>({
    queryKey: ["outstanding-summary", cardCode],
    queryFn: () => getOutstandingSummary(),
    enabled: !!cardCode,
  });

  const {
    data: orderValue,
    isLoading: isOrderValueLoading,
    isError: isOrderValueError,
  } = useQuery<OrderValue>({
    queryKey: ["home", "order-value", cardCode],
    queryFn: () =>
      getOrderValue(cardCode!, {
        fromDate: undefined,
        toDate: undefined,
        query: undefined,
        verticals: undefined,
        orderStatus: undefined,
      }),
    enabled: !!cardCode,
  });

  const {
    data: analyticsPoints,
    isLoading: isSalesTrendLoading,
    isError: isSalesTrendError,
  } = useQuery({
    queryKey: ["home", "sales-trend", salesRange],
    queryFn: () => getInvoiceAnalytics(RANGE_TO_ANALYTICS_TYPE[salesRange]),
    placeholderData: keepPreviousData,
  });

  return {
    partner,
    outstandingSummary,
    orderValue,
    salesTrend: toSalesTrend(analyticsPoints ?? []),
    isSalesTrendLoading,
    isSalesTrendError,
    isLoading: isPartnerLoading || isOutstandingLoading || isOrderValueLoading,
    isError: isPartnerError || isOutstandingError || isOrderValueError,
  };
}