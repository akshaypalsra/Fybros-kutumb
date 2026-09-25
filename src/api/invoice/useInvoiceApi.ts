import { useAxios } from "@/axios/hooks/useAxios";
import {
  searchInvoices,
  getOrderInvoices,
  getInvoice,
  getInvoiceStatistics,
  getInvoiceItems,
  downloadInvoicePdf,
} from "./invoiceApi";
import type { SearchInvoicesParams } from "@/types/invoice.types";

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
    getInvoiceItems: (invoiceId: string) =>
      getInvoiceItems(axiosInstance, invoiceId),
    downloadInvoicePdf: (docEntry: string) =>
      downloadInvoicePdf(axiosInstance, docEntry),
  };
};