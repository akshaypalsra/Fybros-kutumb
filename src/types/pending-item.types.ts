export interface PendingItem {
    itemCode: string;
    itemDescription: string;
    pendingQuantity: number;
    orderCount: number;
    vertical: string;
}

export interface SearchPendingItemsParams {
    page?: number;
    size?: number;
    fromDate?: string;
    toDate?: string;
    query?: string;
    verticals?: string[];
}


export interface PendingItemOrderDetail {
    cardCode: string;
    orderNumber: string;
    docDate: string;
    totalQuantity: number;
    pendingPendingQuantity: number;
    incoterm?: string;
}