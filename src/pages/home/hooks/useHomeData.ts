import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { InvoiceAnalyticsPoint, InvoiceAnalyticsType } from "@/api/invoice/invoiceApi";
import { useInvoiceApi } from "@/api/invoice/useInvoiceApi";
import { useOutstandingSummary } from "@/hooks/useOutstandingSummary";
import { useActiveBusinessPartner } from "@/hooks/useActiveBusinessPartner";
import { useOrderValue } from "@/pages/order/hooks/useOrderValue";

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
  const { getInvoiceAnalytics } = useInvoiceApi();

  const { partner, businessPartnerId, isPartnerLoading, isPartnerError, enabled } = useActiveBusinessPartner();

  const {
    data: outstandingSummary,
    isLoading: isOutstandingLoading,
    isError: isOutstandingError,
  } = useOutstandingSummary(businessPartnerId, enabled);

  const {
    orderValue,
    isOrderValueLoading,
    isOrderValueError,
  } = useOrderValue({
    cardCode: businessPartnerId,
    queryKeyPrefix: ["home", "order-value"],
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