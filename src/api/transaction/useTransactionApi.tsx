import { useAxios } from "@/axios/hooks/useAxios";
import { getBusinessPartnerLedgers, getBusinessPartnerLedgerStats} from "./transactionApi";
import type { GetLedgersParams, GetLedgerStatsParams } from "@/types/ledger.types";


export const useLedgerApi = () => {
  const { axiosInstance } = useAxios();

  return {
    getBusinessPartnerLedgers: (params: GetLedgersParams) =>
      getBusinessPartnerLedgers(axiosInstance, params),
     getBusinessPartnerLedgerStats: (params: GetLedgerStatsParams) =>
      getBusinessPartnerLedgerStats(axiosInstance, params),
  };
};