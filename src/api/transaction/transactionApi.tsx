import type { AxiosInstance } from "axios";
import type { PagedResponse } from "@/types/common.types";
import type { GetLedgersParams, GetLedgerStatsParams, LedgerEntry, LedgerStats } from "@/types/ledger.types";

export const getBusinessPartnerLedgers = async (
  axiosInstance: AxiosInstance,
  params: GetLedgersParams,
): Promise<PagedResponse<LedgerEntry>> => {
  const response = await axiosInstance.get<PagedResponse<LedgerEntry>>(
    "/business-partners/ledgers",
    {
      params: {
        businessPartnerId: params.businessPartnerId,
        query: params.query || undefined,
        fromDate: params.fromDate || undefined,
        toDate: params.toDate || undefined,
        sortDirection: params.sortDirection ?? "ASC",
        page: params.page ?? 0,
        size: params.size,
      },
    },
  );

  return response.data;
};

export const getBusinessPartnerLedgerStats = async (
  axiosInstance: AxiosInstance,
  params: GetLedgerStatsParams,
): Promise<LedgerStats> => {
  const response = await axiosInstance.get<LedgerStats>(
    "/business-partners/ledgers/stats",
    {
      params: {
        businessPartnerId: params.businessPartnerId,
      },
    },
  );

  return response.data;
};