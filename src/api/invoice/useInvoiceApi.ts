import { useAxios } from "@/axios/hooks/useAxios";
import {
  searchInvoices,
  getOrderInvoices,
  getInvoice,
  getInvoiceStatistics,
  type SearchInvoicesParams,
} from "./invoiceApi";

export const useInvoiceApi = () => {
  const { axiosInstance } = useAxios();

  return {
    searchInvoices: (params: SearchInvoicesParams) =>
      searchInvoices(axiosInstance, params),
    getOrderInvoices: (orderId: string) =>
      getOrderInvoices(axiosInstance, orderId),
    getInvoice: (invoiceId: string) => getInvoice(axiosInstance, invoiceId),
    getInvoiceStatistics: (businessPartnerId: string) =>
      getInvoiceStatistics(axiosInstance, businessPartnerId),
  };
};