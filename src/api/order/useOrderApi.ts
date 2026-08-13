import { useAxios } from "@/axios/hooks/useAxios";
import {
  searchOrders,
  getOrder,
  getOrderItems,
  getOrderItem,
  getOrderValue,
  type SearchOrdersParams,
  getOrderInvoices,
} from "./orderApi";

export const useOrderApi = () => {
  const { axiosInstance } = useAxios();

  return {
   searchOrders: (params: SearchOrdersParams) => searchOrders(axiosInstance, params),
    getOrder: (orderId: string) => getOrder(axiosInstance, orderId),
    getOrderItems: (orderId: string) => getOrderItems(axiosInstance, orderId),
    getOrderItem: (orderItemId: string) =>
      getOrderItem(axiosInstance, orderItemId),
    getOrderValue: (businessPartnerId: string) =>
      getOrderValue(axiosInstance, businessPartnerId),
    getOrderInvoices: (orderId: string) => getOrderInvoices(axiosInstance, orderId),
  };
};