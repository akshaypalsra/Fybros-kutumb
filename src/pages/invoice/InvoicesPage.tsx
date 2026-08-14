import { useState } from "react"
import { useQuery } from "@tanstack/react-query"

import { useBusinessPartnerApi } from "@/api/business/useBusinessPartnerApi"
import type { Tab } from "@/types/invoice.types"

import { FinanceHeader } from "./components/FinanceHeader"
import { ListFilters } from "./components/ListFilters"
import { OverviewTab } from "./components/OverviewTab"
import { InvoicesTab } from "./components/InvoicesTab"
import { TransactionsTab } from "./components/TransactionsTab"
import { useVerticals } from "@/hooks/useVerticals"

const FinanceOverviewPage = () => {
  const { getBusinessPartners } = useBusinessPartnerApi()
  const [activeTab, setActiveTab] = useState<Tab>("overview")
  const [search, setSearch] = useState("")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [selectedVerticals, setSelectedVerticals] = useState<string[]>([])

  const { data: partner } = useQuery({
    queryKey: ["business-partner"],
    queryFn: () => getBusinessPartners(),
  })

  const businessPartnerId = partner?.cardCode ?? ""
  const enabled = !!businessPartnerId
  const { verticals } = useVerticals()
  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab)
    setSearch("")
    setDateFrom("")
    setDateTo("")
    setSelectedVerticals([])
  }

  const showListFilters = activeTab === "invoices" || activeTab === "transactions"
  const searchPlaceholder =
    activeTab === "invoices" ? "Search by invoice number..." : "Search by reference or order no."

  return (
    <div className="mx-auto max-w-6xl">
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
          dateFrom={dateFrom}
          dateTo={dateTo}
          onDateFromChange={setDateFrom}
          onDateToChange={setDateTo}
          verticals={verticals}
          selectedVerticals={selectedVerticals}
          onVerticalsChange={setSelectedVerticals}
        />
      )}

      {activeTab === "overview" && (
        <OverviewTab
          businessPartnerId={businessPartnerId}
          enabled={enabled}
          onViewAllInvoices={() => handleTabChange("invoices")}
        />
      )}

      {activeTab === "invoices" && (
        <InvoicesTab
          businessPartnerId={businessPartnerId}
          enabled={enabled}
          search={search}
          dateFrom={dateFrom}
          dateTo={dateTo}
          selectedVerticals={selectedVerticals}
        />
      )}

      {activeTab === "transactions" && (
        <TransactionsTab
          businessPartnerId={businessPartnerId}
          enabled={enabled}
          search={search}
          dateFrom={dateFrom}
          dateTo={dateTo}
          selectedVerticals={selectedVerticals}
        />
      )}
    </div>
  )
}

export default FinanceOverviewPage