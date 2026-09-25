import type { AxiosInstance } from "axios"
import type { InvoiceAnalyticsType } from "../invoice/invoiceApi"

export interface InvoiceAnalyticsData {
  period: string
  label: string
  amount: number
}

export interface InvoiceAnalyticsYear {
  year: number
  data: InvoiceAnalyticsData[]
}

export interface DashboardStats {
  outstandingInvoiceAmount: number
  overdueInvoiceAmount: number
  pendingOrderAmount: number
}

export interface InvoiceSummary {
  monthTotal: number
  quarterTotal: number
  yearTotal: number
}

export const getDashboardStats = async (
  axiosInstance: AxiosInstance,
  verticals?: string[]
): Promise<DashboardStats> => {
  const response = await axiosInstance.get<DashboardStats>(
    "/business-partners/outstanding",
    { params: { verticals } }
  );

  return response.data;
};

export const getInvoiceSummary = async (
  axiosInstance: AxiosInstance,
  verticals?: string[]
): Promise<InvoiceSummary> => {
  const response = await axiosInstance.get<InvoiceSummary>(
    "/business-partners/invoices/summary",
    { params: { verticals } }
  );

  return response.data;
};

export const getInvoiceAnalytics = async (
  axiosInstance: AxiosInstance,
  analyticsType: InvoiceAnalyticsType,
  verticals?: string[]
): Promise<InvoiceAnalyticsYear[]> => {
  const response = await axiosInstance.get<InvoiceAnalyticsYear[]>(
    "/business-partners/invoices/analytics",
    { params: { analyticsType, verticals } }
  );

  return response.data;
};