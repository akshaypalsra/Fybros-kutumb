import { useAxios } from "@/axios/hooks/useAxios";
import { getBusinessPartnerLedgers} from "./transactionApi";
import type { GetLedgersParams } from "@/types/ledger.types";


export const useLedgerApi = () => {
  const { axiosInstance } = useAxios();

  return {
    getBusinessPartnerLedgers: (params: GetLedgersParams) =>
      getBusinessPartnerLedgers(axiosInstance, params),
  };
};