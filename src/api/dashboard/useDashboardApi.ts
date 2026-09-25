import { useAxios } from "@/axios/hooks/useAxios"
import {
  getDashboardStats,
  getInvoiceSummary,
  getInvoiceAnalytics,
} from "./dashboardApi"
import type { InvoiceAnalyticsType } from "../invoice/invoiceApi"

export const useDashboardApi = () => {
  const { axiosInstance } = useAxios()

  return {
    getDashboardStats: (verticals?: string[]) =>
      getDashboardStats(axiosInstance, verticals),
    getInvoiceSummary: (verticals?: string[]) =>
      getInvoiceSummary(axiosInstance, verticals),
    getInvoiceAnalytics: (analyticsType: InvoiceAnalyticsType, verticals?: string[]) =>
      getInvoiceAnalytics(axiosInstance, analyticsType, verticals),
  }
}