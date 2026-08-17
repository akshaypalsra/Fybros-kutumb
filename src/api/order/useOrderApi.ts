import { useAxios } from "@/axios/hooks/useAxios";
import {
  searchOrders,
  getOrder,
  getOrderItems,
  getOrderItem,
  getOrderValue,

  getOrderInvoices,
} from "./orderApi";
import type { SearchOrdersParams } from "@/types/order.types";

export const useOrderApi = () => {
  const { axiosInstance } = useAxios();

  return {
    searchOrders: (params: SearchOrdersParams) => searchOrders(axiosInstance, params),
    getOrder: (orderId: string) => getOrder(axiosInstance, orderId),
    getOrderItems: (orderId: string) => getOrderItems(axiosInstance, orderId),
    getOrderItem: (orderItemId: string) =>
      getOrderItem(axiosInstance, orderItemId),
   getOrderValue: (businessPartnerId: string, filters?: Parameters<typeof getOrderValue>[2]) =>
  getOrderValue(axiosInstance, businessPartnerId, filters),
    getOrderInvoices: (orderId: string) => getOrderInvoices(axiosInstance, orderId),
  };
};