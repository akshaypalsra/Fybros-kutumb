export interface SearchOrdersFilters {
  fromDate?: string
  toDate?: string
  query?: string
  verticals?: string[]
}


export interface Order {
  docEntry: number
  docNum: number
  orderNumber: string
  docDate: string
  docDueDate: string
  cardCode: string
  cardName: string
  fatherCard: string
  docTotal: number
  documentStatus: string
  cancelled: string
  comments: string
  totalItems: number
  deliveredOrderValue:number
  totalQuantity: number
  deliveredQuantity: number
  pendingQuantity: number
  cancelledQuantity: number
  fulfilledPercentage: number
  openOrderValue: number
  vertical: string
  orderStatus: "OPEN" | "CLOSED" | "CANCELLED" | string
  orderDeliveryStatus: "OPEN" | "FULLY_DELIVERED" | "PARTIALLY_DELIVERED" | string
  orderType: string
}

export type TabFilter = "ALL" | "OPEN" | "CLOSED"

export interface OrderStats {
  openCount: number
  closedCount: number
  totalOrderValue: number
  openOrderValue: number
  fillRate: number
  avgOrderSize: number
  deliveredOrderValue:number
  
}

export interface OrderItem {
  id: number
  itemCode: string
  itemDescription: string
  quantity: number
  price: number
  status: string
  unitsOfMeasurment: number
  lineTotal: number
  remainingOpenQuantity: number
  measureUnit: string
  deliveryStatus: "DELIVERED" | "PENDING" | "PARTIAL" | string
}

export interface OrderValue {
  businessPartnerId: string;
  totalValue: number;
}

export interface OrderItemDetail {
  lineNumber: number
  itemCode: string
  itemDescription: string
  orderNumber: string
  price: number
  hsnCode: string
  lineTotal: number
  measureUnit: string
  quantity: number
  pendingQuantity: number
  deliveryQuantity: number
  deliveryStatus: "OPEN" | "DELIVERED" | "PARTIAL" | string
}
