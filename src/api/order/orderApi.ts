import type { AxiosInstance } from "axios";
import type { Order, OrderItem, OrderValue, SearchOrdersParams } from "@/types/order.types";
import type { Invoice } from "@/types/invoice.types";
import type { PagedResponse } from "@/types/common.types";

import { toIsoStart, toIsoEnd } from "@/utils/date.utils";

export const searchOrders = async (
    axiosInstance: AxiosInstance,
    params: SearchOrdersParams,
): Promise<PagedResponse<Order>> => {
    const { page, size, ...rest } = params;

    const response = await axiosInstance.post<PagedResponse<Order>>(
        "/business-partners/orders/search",
        {
            ...rest,
            fromDate: params.fromDate ? toIsoStart(params.fromDate) : undefined,
            toDate: params.toDate ? toIsoEnd(params.toDate) : undefined,
        },
        {
            params: { page, size },
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