import type { Order } from "@/types/order.types";

export interface OrderDetailExtras {
  itemCount?: number;
  category?: string;
  orderType?: string;
  deliveredValue?: number;
}

export type OrderWithExtras = Order & OrderDetailExtras;

export type ItemFilter = "ALL" | "DELIVERED" | "PENDING";