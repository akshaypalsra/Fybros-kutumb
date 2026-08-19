import type { AxiosInstance } from "axios";

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
}

const toIsoStart = (date: string) => new Date(`${date}T00:00:00.000Z`).toISOString();
const toIsoEnd = (date: string) => new Date(`${date}T23:59:59.999Z`).toISOString();

export const getBusinessPartnerLedgers = async (
  axiosInstance: AxiosInstance,
  params: GetLedgersParams,
): Promise<LedgerEntry[]> => {
  const response = await axiosInstance.get<LedgerEntry[]>(
    "/business-partners/ledgers",
    {
      params: {
        businessPartnerId: params.businessPartnerId,
        fromDate: params.fromDate ? toIsoStart(params.fromDate) : undefined,
        toDate: params.toDate ? toIsoEnd(params.toDate) : undefined,
      },
    },
  );

  return response.data;
};