

export interface Transaction {
  id: string | number
  referenceNumber: string 
  orderNumber?: string | null 
  transactionDate: string
  amount: number
  status: "RECEIVED" | "BOUNCED" | "PENDING" | string
  noteType?: "CREDIT_NOTE" | "DEBIT_NOTE" | null
  vertical?: string | null
}

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 1,
    referenceNumber: "NEFT-85786",
    orderNumber: "T1234YP9088",
    transactionDate: "2026-05-15",
    amount: 63000,
    status: "RECEIVED",
    noteType: "CREDIT_NOTE",
    vertical: "Switches & Accessories",
  },
  {
    id: 2,
    referenceNumber: "NEFT-85786",
    orderNumber: "T1234YP9086",
    transactionDate: "2026-05-12",
    amount: 188000,
    status: "RECEIVED",
    noteType: "CREDIT_NOTE",
    vertical: "Fans",
  },
  {
    id: 3,
    referenceNumber: "CHQ-44201",
    orderNumber: "T1234YP9067",
    transactionDate: "2026-05-15",
    amount: 147000,
    status: "BOUNCED",
    noteType: "DEBIT_NOTE",
    vertical: "Wires",
  },
  {
    id: 4,
    referenceNumber: "CHQ-44188",
    orderNumber: "T1234YP909766",
    transactionDate: "2026-04-30",
    amount: 217300,
    status: "RECEIVED",
    noteType: "CREDIT_NOTE",
    vertical: "Switches & Accessories",
  },
]


const delay = <T,>(value: T, ms = 500): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms))

export const useTransactionApi = () => {
  const searchTransactions = (_businessPartnerId: string): Promise<Transaction[]> => {
    return delay(MOCK_TRANSACTIONS)
  }

  return { searchTransactions }
}