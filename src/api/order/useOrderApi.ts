import { useAxios } from "@/axios/hooks/useAxios";
import {
  searchOrders,
  getOrder,
  getOrderItems,
  getOrderItem,
  getOrderValue,
} from "./orderApi";

export const useOrderApi = () => {
  const { axiosInstance } = useAxios();

  return {
    searchOrders: (businessPartnerId: string) =>
      searchOrders(axiosInstance, businessPartnerId),
    getOrder: (orderId: string) => getOrder(axiosInstance, orderId),
    getOrderItems: (orderId: string) => getOrderItems(axiosInstance, orderId),
    getOrderItem: (orderItemId: string) =>
      getOrderItem(axiosInstance, orderItemId),
    getOrderValue: (businessPartnerId: string) =>
      getOrderValue(axiosInstance, businessPartnerId),
  };
};