import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { InvoiceAnalyticsType} from "@/api/invoice/invoiceApi";
import { useOutstandingSummary } from "@/hooks/useOutstandingSummary";
import { useActiveBusinessPartner } from "@/hooks/useActiveBusinessPartner";
import { useOrderValue } from "@/pages/order/hooks/useOrderValue";
import type { SalesTrend } from "../components/SalesSnapshotSection";
import type { InvoiceAnalyticsYear } from "@/types/invoice.types";
import { useDashboardApi } from "@/api/dashboard/useDashboardApi";


interface UseHomeDataParams {
  salesRange: "MoM" | "QoQ";
  verticals?: string[];
}

const RANGE_TO_ANALYTICS_TYPE: Record<"MoM" | "QoQ", InvoiceAnalyticsType> = {
  MoM: "MONTH_OVER_MONTH",
  QoQ: "QUARTER_OVER_QUARTER",
};

function toSalesTrend(years: InvoiceAnalyticsYear[]): SalesTrend {
  const sorted = [...years].sort((a, b) => a.year - b.year);
  const current = sorted.at(-1);
  const currentData = current?.data ?? [];
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

export function useHomeData({ salesRange, verticals }: UseHomeDataParams) {
  const { getInvoiceAnalytics, getInvoiceSummary, getDashboardStats } = useDashboardApi();

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
    queryKey: ["home", "sales-trend", salesRange, verticals],
    queryFn: () => getInvoiceAnalytics(RANGE_TO_ANALYTICS_TYPE[salesRange], verticals),
    placeholderData: keepPreviousData,
  });

  const {
    data: invoiceSummary,
    isLoading: isInvoiceSummaryLoading,
    isError: isInvoiceSummaryError,
  } = useQuery({
    queryKey: ["home", "invoice-summary", verticals],
    queryFn: () => getInvoiceSummary(verticals),
  });

  const {
    data: dashboardStats,
    isLoading: isDashboardStatsLoading,
    isError: isDashboardStatsError,
  } = useQuery({
    queryKey: ["home", "dashboard-stats", verticals],
    queryFn: () => getDashboardStats(verticals),
  });

  return {
    partner,
    outstandingSummary,
    invoiceSummary,
    dashboardStats,
    orderValue,
    salesTrend: toSalesTrend(analyticsYears ?? []),
    isSalesTrendLoading,
    isSalesTrendError,
    isLoading:
      isPartnerLoading ||
      isOutstandingLoading ||
      isOrderValueLoading ||
      isInvoiceSummaryLoading ||
      isDashboardStatsLoading,
    isError:
      isPartnerError ||
      isOutstandingError ||
      isOrderValueError ||
      isInvoiceSummaryError ||
      isDashboardStatsError,
  };
}