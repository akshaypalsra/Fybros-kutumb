export interface Order {
  docEntry: number
  orderNumber: string
  status: string
  docDate: string
  docDueDate?: string
  cardName?: string | null
  cardCode?: string
  shipToCode?: string | null
  docTotal?: number
}


export interface SearchOrdersFilters {
  fromDate?: string
  toDate?: string
  query?: string
  verticals?: string[]
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
