export interface LedgerEntry {
    credit: number;
    debit: number;
    lineMemo: string;
    referenceDate: string;
    docNumber: string;
}

export type SortDirection = "ASC" | "DESC";

export interface GetLedgersParams {
  businessPartnerId: string;
  query?: string;
  fromDate?: string;
  toDate?: string;
  sortDirection?: SortDirection;
  page?: number;
  size?: number;
}

export interface LedgerStats {
  totalCredit: number;
  totalDebit: number;
}

export interface GetLedgerStatsParams {
  businessPartnerId: string;
}