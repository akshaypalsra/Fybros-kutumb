import type { AxiosInstance } from "axios";
import type { Order, OrderItem, OrderValue } from "@/types/order.types";
import type { Invoice } from "@/types/invoice.types";

export interface PagedResponse<T> {
    content: T[]
    totalElements?: number
    totalPages?: number
    number?: number
    size?: number
}


export interface SearchOrdersParams {
    businessPartnerId: string
    fromDate?: string
    toDate?: string
    query?: string
    verticals?: string[]
    page?: number
    size?: number
    orderStatus?: string
}




export const searchOrders = async (
    axiosInstance: AxiosInstance,
    params: SearchOrdersParams
): Promise<Order[]> => {
    const response = await axiosInstance.post<PagedResponse<Order>>(
        "/business-partners/orders/search",
        params
    )

    return response.data.content
}
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
    businessPartnerId: string
): Promise<OrderValue> => {
    const response = await axiosInstance.get<OrderValue>(
        "/business-partners/order-value",
        { params: { businessPartnerId } }
    );

    return response.data;
};