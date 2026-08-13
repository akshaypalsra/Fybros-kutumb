import { useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"

import { useBusinessPartnerApi } from "@/api/business/useBusinessPartnerApi"
import { useInvoiceApi } from "@/api/invoice/useInvoiceApi"
import type { AgeingBucketResponse, CreditOverview, OutstandingSummary } from "@/types/businessPartner.types"
import type { DatePreset, Invoice, InvoiceSubTab, Tab, TransactionSubTab } from "@/types/invoice.types"
import { useTransactionApi, type Transaction } from "@/hooks/useTransaction"
import { OverviewTab } from "./components/OverviewTab"
import { ListFilters } from "./components/ListFilters"
import { FinanceHeader } from "./components/FinanceHeader"
import { formatMonthYear, getDateCutoff } from "@/utils/invoice.utils"
import { InvoicesTab } from "./components/InvoicesTab"
import { TransactionsTab } from "./components/TransactionsTab"



const FinanceOverviewPage = () => {
  const { getBusinessPartners, getCreditOverview, getOutstandingSummary, getAgeingDistribution } =
    useBusinessPartnerApi()
  const { searchInvoices } = useInvoiceApi()
  const { searchTransactions } = useTransactionApi()

  const [activeTab, setActiveTab] = useState<Tab>("overview")

  // Shared list-view filter state (Invoices + Transactions tabs)
  const [search, setSearch] = useState("")
  const [datePreset, setDatePreset] = useState<DatePreset>("ALL")
  const [verticalFilter, setVerticalFilter] = useState<string>("ALL")
  const [invoiceSubTab, setInvoiceSubTab] = useState<InvoiceSubTab>("ALL")
  const [transactionSubTab, setTransactionSubTab] = useState<TransactionSubTab>("ALL")

  const { data: partner, isLoading: isPartnerLoading } = useQuery({
    queryKey: ["business-partner"],
    queryFn: () => getBusinessPartners(),
  })

  const businessPartnerId = partner?.cardCode ?? ""
  const enabled = !!businessPartnerId

  // GET /api/business-partners/credit-overview
  const {
    data: creditOverview,
    isLoading: isCreditLoading,
    isError: isCreditError,
  } = useQuery<CreditOverview>({
    queryKey: ["credit-overview", businessPartnerId],
    queryFn: () => getCreditOverview(),
    enabled,
  })

  // GET /api/business-partners/outstanding-summary
  const {
    data: outstandingSummary,
    isLoading: isOutstandingLoading,
    isError: isOutstandingError,
  } = useQuery<OutstandingSummary>({
    queryKey: ["outstanding-summary", businessPartnerId],
    queryFn: () => getOutstandingSummary(),
    enabled,
  })

  const {
    data: ageingDistribution,
    isLoading: isAgeingLoading,
    isError: isAgeingError,
  } = useQuery<AgeingBucketResponse[]>({
    queryKey: ["ageing-distribution", businessPartnerId],
    queryFn: () => getAgeingDistribution(),
    enabled,
  })

  const {
    data: invoices,
    isLoading: isInvoiceLoading,
    isError: isInvoiceError,
  } = useQuery<Invoice[]>({
    queryKey: ["invoices", businessPartnerId],
    queryFn: () => searchInvoices(businessPartnerId) as unknown as Promise<Invoice[]>,
    enabled,
  })

  // GET /api/transactions (placeholder — see useTransactionApi)
  const {
    data: transactions,
    isLoading: isTransactionLoading,
    isError: isTransactionError,
  } = useQuery<Transaction[]>({
    queryKey: ["transactions", businessPartnerId],
    queryFn: () => searchTransactions(businessPartnerId) as unknown as Promise<Transaction[]>,
    enabled: enabled && activeTab === "transactions",
  })

  const pendingInvoices = (invoices ?? []).filter((inv) => inv.status !== "PAID")

  const isOverviewLoading =
    isPartnerLoading || isCreditLoading || isOutstandingLoading || isAgeingLoading || isInvoiceLoading
  const isOverviewError = isCreditError || isOutstandingError || isAgeingError || isInvoiceError

  // Reset list-view filters whenever the tab changes, and clear search so it
  // doesn't silently carry over between Invoices and Transactions.
  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab)
    setSearch("")
    setDatePreset("ALL")
    setVerticalFilter("ALL")
  }

  const invoiceVerticals = useMemo(
    () => Array.from(new Set((invoices ?? []).map((inv) => inv.vertical).filter(Boolean))) as string[],
    [invoices]
  )
  const transactionVerticals = useMemo(
    () => Array.from(new Set((transactions ?? []).map((t) => t.vertical).filter(Boolean))) as string[],
    [transactions]
  )

  const dateCutoff = getDateCutoff(datePreset)

  const baseFilteredInvoices = useMemo(() => {
    const query = search.trim().toLowerCase()
    return (invoices ?? []).filter((invoice) => {
      const matchesSearch = !query || invoice.invoiceNumber?.toLowerCase().includes(query)
      const matchesVertical = verticalFilter === "ALL" || invoice.vertical === verticalFilter
      const matchesDate = !dateCutoff || (invoice.docDate && new Date(invoice.docDate) >= dateCutoff)
      return matchesSearch && matchesVertical && matchesDate
    })
  }, [invoices, search, verticalFilter, dateCutoff])

  const invoiceCounts: Partial<Record<InvoiceSubTab, number>> = {
    ALL: baseFilteredInvoices.length,
    OPEN: baseFilteredInvoices.filter((i) => i.status !== "PAID").length,
    CLOSED: baseFilteredInvoices.filter((i) => i.status === "PAID").length,
    OVERDUE: baseFilteredInvoices.filter((i) => i.status === "OVERDUE").length,
  }

  const filteredInvoices = baseFilteredInvoices.filter((invoice) => {
    if (invoiceSubTab === "ALL") return true
    if (invoiceSubTab === "OPEN") return invoice.status !== "PAID"
    if (invoiceSubTab === "CLOSED") return invoice.status === "PAID"
    return invoice.status === "OVERDUE"
  })

  const invoicesByMonth = useMemo(() => {
    const groups = new Map<string, Invoice[]>()
    for (const invoice of filteredInvoices) {
      const key = formatMonthYear(invoice.docDate)
      if (!groups.has(key)) groups.set(key, [])
      groups.get(key)!.push(invoice)
    }
    return Array.from(groups.entries())
  }, [filteredInvoices])

  const baseFilteredTransactions = useMemo(() => {
    const query = search.trim().toLowerCase()
    return (transactions ?? []).filter((txn) => {
      const matchesSearch =
        !query || txn.referenceNumber?.toLowerCase().includes(query) || txn.orderNumber?.toLowerCase().includes(query)
      const matchesVertical = verticalFilter === "ALL" || txn.vertical === verticalFilter
      const matchesDate = !dateCutoff || (txn.transactionDate && new Date(txn.transactionDate) >= dateCutoff)
      return matchesSearch && matchesVertical && matchesDate
    })
  }, [transactions, search, verticalFilter, dateCutoff])

  const transactionCounts: Partial<Record<TransactionSubTab, number>> = {
    ALL: baseFilteredTransactions.length,
    CREDIT_NOTE: baseFilteredTransactions.filter((t) => t.noteType === "CREDIT_NOTE").length,
    DEBIT_NOTE: baseFilteredTransactions.filter((t) => t.noteType === "DEBIT_NOTE").length,
  }

  const filteredTransactions = baseFilteredTransactions.filter((txn) => {
    if (transactionSubTab === "ALL") return true
    return txn.noteType === transactionSubTab
  })

  const showListFilters = activeTab === "invoices" || activeTab === "transactions"
  const searchPlaceholder =
    activeTab === "invoices" ? "Search by invoice number..." : "Search by reference or order no."
  const availableVerticals = activeTab === "invoices" ? invoiceVerticals : transactionVerticals

  return (
    <div className="mx-auto max-w-6xl p-6 lg:p-8">
      <FinanceHeader
        partnerName={partner?.cardName ?? ""}
        partnerCode={partner?.cardCode ?? ""}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      {showListFilters && (
        <ListFilters
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder={searchPlaceholder}
          datePreset={datePreset}
          onDatePresetChange={setDatePreset}
          verticalFilter={verticalFilter}
          onVerticalFilterChange={setVerticalFilter}
          availableVerticals={availableVerticals}
        />
      )}

      {activeTab === "overview" && (
        <OverviewTab
          isLoading={isOverviewLoading}
          isError={isOverviewError}
          creditOverview={creditOverview}
          outstandingSummary={outstandingSummary}
          ageingDistribution={ageingDistribution}
          pendingInvoices={pendingInvoices}
          onViewAllInvoices={() => handleTabChange("invoices")}
        />
      )}

      {activeTab === "invoices" && (
        <InvoicesTab
          isLoading={isInvoiceLoading}
          isError={isInvoiceError}
          outstandingSummary={outstandingSummary}
          subTab={invoiceSubTab}
          onSubTabChange={setInvoiceSubTab}
          counts={invoiceCounts}
          invoicesByMonth={invoicesByMonth}
          hasResults={filteredInvoices.length > 0}
        />
      )}

      {activeTab === "transactions" && (
        <TransactionsTab
          isLoading={isTransactionLoading}
          isError={isTransactionError}
          outstandingSummary={outstandingSummary}
          subTab={transactionSubTab}
          onSubTabChange={setTransactionSubTab}
          counts={transactionCounts}
          transactions={filteredTransactions}
        />
      )}
    </div>
  )
}

export default FinanceOverviewPage