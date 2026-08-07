export interface Invoice {
  invoiceId: string;
  invoiceNumber?: string;
  businessPartnerId?: string;
  status?: string;
  createdAt?: string;
  totalAmount?: number;
  docEntry?: string;
}

export interface InvoiceStatistics {
  businessPartnerId: string;
  totalInvoiced?: number;
  totalPaid?: number;
  totalOutstanding?: number;
}