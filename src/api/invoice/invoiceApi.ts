import type { AxiosInstance } from "axios";
import type { Invoice, InvoiceStatistics, SearchInvoicesParams } from "@/types/invoice.types";



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
): Promise<Invoice[]> => {
    const response = await axiosInstance.post<Invoice[]>(
        "/business-partners/invoices/search",
        {
            businessPartnerId,
            fromDate,
            toDate,
            query,
            invoiceStatus,
            verticals,
            page,
            size,
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