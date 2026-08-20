export interface LedgerEntry {
    credit: number;
    debit: number;
    lineMemo: string;
    referenceDate: string;
    docNumber: string;
}

export interface GetLedgersParams {
  businessPartnerId: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
  size?: number;
}