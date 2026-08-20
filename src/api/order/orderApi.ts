import type { AxiosInstance } from "axios";
import type { Order, OrderItem, OrderValue, SearchOrdersParams } from "@/types/order.types";
import type { Invoice } from "@/types/invoice.types";
import type { PagedResponse } from "@/types/common.types";

const toStartOfDayISO = (date?: string) => (date ? `${date}T00:00:00.000Z` : undefined);
const toEndOfDayISO = (date?: string) => (date ? `${date}T23:59:59.999Z` : undefined);

export const searchOrders = async (
    axiosInstance: AxiosInstance,
    params: SearchOrdersParams,
): Promise<PagedResponse<Order>> => {
    const response = await axiosInstance.post<PagedResponse<Order>>(
        "/business-partners/orders/search",
        {
            ...params,
            fromDate: toStartOfDayISO(params.fromDate),
            toDate: toEndOfDayISO(params.toDate),
        },
    );
    return response.data;
};

export const getOrder = async (
    axiosInstance: AxiosInstance,
    orderId: string
): Promise<Order> => {
    const response = await axiosInstance.get<Order>(`/orders/${orderId}`);

    return response.data;
};

export const getOrderInvoices = async (
    axiosInstance: AxiosInstance,
    orderId: string
): Promise<Invoice[]> => {
    const response = await axiosInstance.get<Invoice[]>(`/orders/${orderId}/invoices`);

    return response.data;
};

export const getOrderItems = async (
    axiosInstance: AxiosInstance,
    orderId: string
): Promise<OrderItem[]> => {
    const response = await axiosInstance.get<OrderItem[]>(
        `/orders/${orderId}/items`
    );

    return response.data;
};

export const getOrderItem = async (
    axiosInstance: AxiosInstance,
    orderItemId: string
): Promise<OrderItem> => {
    const response = await axiosInstance.get<OrderItem>(
        `/order-item/${orderItemId}`
    );

    return response.data;
};

export const getOrderValue = async (
    axiosInstance: AxiosInstance,
    businessPartnerId: string,
    filters?: {
        fromDate?: string;
        toDate?: string;
        query?: string;
        verticals?: string[];
        orderStatus?: string;
    }
): Promise<OrderValue> => {
    const response = await axiosInstance.get<OrderValue>(
        "/business-partners/order-value",
        { params: { businessPartnerId, ...filters } }
    );

    return response.data;
};