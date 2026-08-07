import { useAxios } from "@/axios/hooks/useAxios";
import {
  searchInvoices,
  getOrderInvoices,
  getInvoice,
  getInvoiceStatistics,
  
} from "./invoiceApi";

export const useInvoiceApi = () => {
  const { axiosInstance } = useAxios();

  return {
    searchInvoices: (businessPartnerId: string) =>
      searchInvoices(axiosInstance, businessPartnerId),
    getOrderInvoices: (orderId: string) =>
      getOrderInvoices(axiosInstance, orderId),
    getInvoice: (invoiceId: string) => getInvoice(axiosInstance, invoiceId),
    getInvoiceStatistics: (businessPartnerId: string) =>
      getInvoiceStatistics(axiosInstance, businessPartnerId),
  };
};