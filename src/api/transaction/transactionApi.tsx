import type { AxiosInstance } from "axios";
import type { PagedResponse } from "@/types/common.types";
import type { GetLedgersParams, LedgerEntry } from "@/types/ledger.types";
import { toIsoStart, toIsoEnd } from "@/utils/date.utils";

export const getBusinessPartnerLedgers = async (
  axiosInstance: AxiosInstance,
  params: GetLedgersParams,
): Promise<PagedResponse<LedgerEntry>> => {
  const response = await axiosInstance.get<PagedResponse<LedgerEntry>>(
    "/business-partners/ledgers",
    {
      params: {
        businessPartnerId: params.businessPartnerId,
        fromDate: params.fromDate ? toIsoStart(params.fromDate) : undefined,
        toDate: params.toDate ? toIsoEnd(params.toDate) : undefined,
        page: params.page,
        size: params.size,
      },
    },
  );

  return response.data;
};