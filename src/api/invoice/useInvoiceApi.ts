import { useAxios } from "@/axios/hooks/useAxios";
import {
  searchInvoices,
  getOrderInvoices,
  getInvoice,
  getInvoiceStatistics,
  type InvoiceAnalyticsType,
  getInvoiceAnalytics,
  getInvoiceItems,
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
    getInvoiceAnalytics: (analyticsType: InvoiceAnalyticsType) =>
      getInvoiceAnalytics(axiosInstance, analyticsType),
    getInvoiceItems: (invoiceId: string) =>
      getInvoiceItems(axiosInstance, invoiceId),
  };
};