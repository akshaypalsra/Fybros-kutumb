import type { AxiosInstance } from "axios";
import type { Invoice, InvoiceItem, InvoiceStatistics, SearchInvoicesParams } from "@/types/invoice.types";
import type { PagedResponse } from "@/types/common.types";

export const searchInvoices = async (
    axiosInstance: AxiosInstance,
    {
        businessPartnerId,
        fromDate,
        toDate,
        query,
        invoiceStatus,
        verticals,
        page = 0,
        size = 20,
    }: SearchInvoicesParams
): Promise<PagedResponse<Invoice>> => {
    const response = await axiosInstance.post<PagedResponse<Invoice>>(
        "/business-partners/invoices/search/v2",
        {
            businessPartnerId,
            fromDate,
            toDate,
            query,
            invoiceStatus,
            verticals,
        },
        {
            params: { page, size },
        }
    );

    return response.data;
};

export const getOrderInvoices = async (
    axiosInstance: AxiosInstance,
    orderId: string
): Promise<Invoice[]> => {
    const response = await axiosInstance.get<Invoice[]>(
        `/orders/${orderId}/invoices`
    );

    return response.data;
};

export const getInvoice = async (
    axiosInstance: AxiosInstance,
    invoiceId: string
): Promise<Invoice> => {
    const response = await axiosInstance.get<Invoice>(
        `/invoices/${invoiceId}`
    );

    return response.data;
};

export const getInvoiceStatistics = async (
    axiosInstance: AxiosInstance,
    businessPartnerId: string
): Promise<InvoiceStatistics> => {
    const response = await axiosInstance.get<InvoiceStatistics>(
        "/business-partners/invoices/statistics",
        { params: { businessPartnerId } }
    );

    return response.data;
};



export const getInvoiceItems = async (
    axiosInstance: AxiosInstance,
    invoiceId: string,
): Promise<InvoiceItem[]> => {
    const response = await axiosInstance.get<InvoiceItem[]>(
        `/invoice/${invoiceId}/items`,
    );

    return response.data;
};

export type InvoiceAnalyticsType = "MONTH_OVER_MONTH" | "QUARTER_OVER_QUARTER" | "YEAR_OVER_YEAR";

export interface InvoiceAnalyticsPoint {
    period: string;
    label: string;
    amount: number;
}

export const getInvoiceAnalytics = async (
    axiosInstance: AxiosInstance,
    analyticsType: InvoiceAnalyticsType
): Promise<InvoiceAnalyticsPoint[]> => {
    const response = await axiosInstance.get<InvoiceAnalyticsPoint[]>(
        "/business-partners/invoices/analytics",
        { params: { analyticsType } }
    );

    return response.data;
};