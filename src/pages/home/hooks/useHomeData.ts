import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { InvoiceAnalyticsType} from "@/api/invoice/invoiceApi";
import { useInvoiceApi } from "@/api/invoice/useInvoiceApi";
import { useOutstandingSummary } from "@/hooks/useOutstandingSummary";
import { useActiveBusinessPartner } from "@/hooks/useActiveBusinessPartner";
import { useOrderValue } from "@/pages/order/hooks/useOrderValue";
import type { SalesTrend } from "../components/SalesSnapshotSection";
import type { InvoiceAnalyticsYear } from "@/types/invoice.types";


interface UseHomeDataParams {
  salesRange: "MoM" | "QoQ";
}

const RANGE_TO_ANALYTICS_TYPE: Record<"MoM" | "QoQ", InvoiceAnalyticsType> = {
  MoM: "MONTH_OVER_MONTH",
  QoQ: "QUARTER_OVER_QUARTER",
};

function toSalesTrend(years: InvoiceAnalyticsYear[]): SalesTrend {
  const sorted = [...years].sort((a, b) => a.year - b.year);
  const current = sorted.at(-1);
  const currentData = current?.data ?? [];

  // Last non-zero entry in the current year, so a fully-zeroed future quarter/month doesn't count as "last booked"
  const lastBooked = [...currentData].reverse().find((d) => d.amount > 0);
  const lastIndex = lastBooked ? currentData.indexOf(lastBooked) : -1;
  const prevInSameYear = lastIndex > 0 ? currentData[lastIndex - 1] : undefined;

  const bookedLastMonth = lastBooked?.amount ?? 0;
  const growthPercent =
    prevInSameYear && prevInSameYear.amount !== 0
      ? Math.round(((bookedLastMonth - prevInSameYear.amount) / prevInSameYear.amount) * 100)
      : 0;

  return { years: sorted, bookedLastMonth, growthPercent };
}

export function useHomeData({ salesRange }: UseHomeDataParams) {
  const { getInvoiceAnalytics } = useInvoiceApi();

  const { partner, businessPartnerId, isPartnerLoading, isPartnerError, enabled } = useActiveBusinessPartner();

  const {
    data: outstandingSummary,
    isLoading: isOutstandingLoading,
    isError: isOutstandingError,
  } = useOutstandingSummary(businessPartnerId, enabled);

  const { orderValue, isOrderValueLoading, isOrderValueError } = useOrderValue({
    cardCode: businessPartnerId,
    queryKeyPrefix: ["home", "order-value"],
  });

  const {
    data: analyticsYears,
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
    salesTrend: toSalesTrend(analyticsYears ?? []),
    isSalesTrendLoading,
    isSalesTrendError,
    isLoading: isPartnerLoading || isOutstandingLoading || isOrderValueLoading,
    isError: isPartnerError || isOutstandingError || isOrderValueError,
  };
}