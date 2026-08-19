import { useQuery } from "@tanstack/react-query";
import { useBusinessPartnerApi } from "@/api/business/useBusinessPartnerApi";
import { useInvoiceApi } from "@/api/invoice/useInvoiceApi";
import type { AgeingBucketResponse, CreditOverview } from "@/types/businessPartner.types";
import type { Invoice } from "@/types/invoice.types";
import { useOutstandingSummary } from "../../../hooks/useOutstandingSummary";

interface UseOverviewTabDataParams {
  businessPartnerId: string;
  enabled: boolean;
}

export function useOverviewTabData({ businessPartnerId, enabled }: UseOverviewTabDataParams) {
  const { getCreditOverview, getAgeingDistribution } = useBusinessPartnerApi();
  const { searchInvoices } = useInvoiceApi();

  const {
    data: creditOverview,
    isLoading: isCreditLoading,
    isError: isCreditError,
  } = useQuery<CreditOverview>({
    queryKey: ["credit-overview", businessPartnerId],
    queryFn: () => getCreditOverview(),
    enabled,
  });

  const {
    data: outstandingSummary,
    isLoading: isOutstandingLoading,
    isError: isOutstandingError,
  } = useOutstandingSummary(businessPartnerId, enabled);

  const {
    data: ageingDistribution,
    isLoading: isAgeingLoading,
    isError: isAgeingError,
  } = useQuery<AgeingBucketResponse[]>({
    queryKey: ["ageing-distribution", businessPartnerId],
    queryFn: () => getAgeingDistribution(),
    enabled,
  });

  const {
    data: overviewInvoices,
    isLoading: isInvoiceLoading,
    isError: isInvoiceError,
  } = useQuery<Invoice[]>({
    queryKey: ["invoices", businessPartnerId, "overview"],
    queryFn: () =>
      searchInvoices({
        businessPartnerId,
        invoiceStatus: "PENDING",
        page: 0,
        size: 100,
      }),
    enabled,
  });

  const pendingInvoices = (overviewInvoices ?? []).filter((inv) => inv.status !== "PAID");

  return {
    creditOverview,
    outstandingSummary,
    ageingDistribution,
    pendingInvoices,
    isLoading: isCreditLoading || isOutstandingLoading || isAgeingLoading || isInvoiceLoading,
    isError: isCreditError || isOutstandingError || isAgeingError || isInvoiceError,
  };
}