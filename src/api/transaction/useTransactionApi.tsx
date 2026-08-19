import { useAxios } from "@/axios/hooks/useAxios";
import { getBusinessPartnerLedgers, type GetLedgersParams } from "./transactionApi";


export const useLedgerApi = () => {
  const { axiosInstance } = useAxios();

  return {
    getBusinessPartnerLedgers: (params: GetLedgersParams) =>
      getBusinessPartnerLedgers(axiosInstance, params),
  };
};