// OverviewTab.tsx
import { Link } from "react-router-dom";
import { ChevronRight, FileText } from "lucide-react";
import { Badge } from "@/common/components/ui/badge";
import { Skeleton } from "@/common/components/ui/skeleton";
import { AgeingBar } from "../invoice/AgeingBar";
import { CreditGauge } from "../invoice/CreditGauge";
import { Button } from "@/common/components/ui/button";
import { formatCompactCurrency, formatCurrency, formatDate } from "@/utils/common.utils";
import { StatusBadge } from "@/common/components/StatusBadge";

import { useOverviewTabData } from "../../hooks/useOverviewTabData";
import { QueryState } from "@/wrapper/QueryState";
import { ErrorState } from "@/common/components/ErrorState";
import { EmptyState } from "@/common/components/EmptyState";

interface OverviewTabProps {
  businessPartnerId: string;
  enabled: boolean;
  onViewAllInvoices: () => void;
}

export const OverviewTab = ({ businessPartnerId, enabled, onViewAllInvoices }: OverviewTabProps) => {
  const { creditOverview, outstandingSummary, ageingDistribution, pendingInvoices, isLoading, isError } =
    useOverviewTabData({ businessPartnerId, enabled });

  return (
    <QueryState
      isLoading={isLoading}
      isError={isError}
      loading={
        <div className="grid gap-5 lg:grid-cols-3">
          <Skeleton className="h-48 w-full rounded-2xl lg:col-span-2" />
          <Skeleton className="h-48 w-full rounded-2xl" />
          <Skeleton className="h-40 w-full rounded-2xl lg:col-span-3" />
          <Skeleton className="h-64 w-full rounded-2xl lg:col-span-3" />
        </div>
      }
      error={<ErrorState className="mb-4" message="Failed to load your finance overview. Please try again." />}
    >
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="flex items-center justify-between gap-4 rounded-2xl bg-secondary p-6 text-white shadow-sm lg:col-span-2">
          <div>
            <p className="mb-6 text-sm font-medium text-white/90">Credit overview</p>
            <p className="mb-1 text-3xl font-bold">{formatCompactCurrency(creditOverview?.availableCreditLimit)}</p>
            <p className="text-sm text-white/80">Available credit limit</p>
          </div>
          <CreditGauge pct={creditOverview?.creditUtilizationPercentage ?? 0} />
        </div>

        <div className="rounded-2xl border bg-card p-6 shadow-sm">
          <p className="mb-4 text-sm font-medium text-muted-foreground">Outstanding summary</p>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-xl bg-muted p-3">
              <div>
                <p className="text-xs text-muted-foreground">Outstanding</p>
                <p className="text-[11px] text-muted-foreground">As on today</p>
              </div>
              <p className="text-base font-bold text-foreground">
                {formatCompactCurrency(outstandingSummary?.outstandingAmount)}
              </p>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-muted p-3">
              <div>
                <p className="text-xs text-muted-foreground">Overdue</p>
                <p className="text-[11px] text-muted-foreground">Past due date</p>
              </div>
              <p className="text-base font-bold text-foreground">
                {formatCompactCurrency(outstandingSummary?.overdueAmount)}
              </p>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-muted p-3">
              <p className="text-xs text-muted-foreground">Invoices</p>
              <p className="text-base font-bold text-foreground">{outstandingSummary?.totalInvoices ?? 0}</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-6 shadow-sm lg:col-span-3">
          <p className="mb-4 text-sm font-medium text-muted-foreground">Ageing distribution (days)</p>
          <AgeingBar buckets={ageingDistribution ?? []} />
        </div>

        <div className="rounded-2xl border bg-card p-6 shadow-sm lg:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">Pending invoices ({pendingInvoices.length})</p>
            <Button
              type="button"
              variant="link"
              onClick={onViewAllInvoices}
              className="h-auto gap-1 p-0 text-sm font-medium text-secondary"
            >
              View all
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>

          {pendingInvoices.length === 0 ? (
            <EmptyState message="No pending invoices." />
          ) : (
            <div className="divide-y">
              {pendingInvoices.map((invoice) => (
                <Link
                  key={invoice.docEntry}
                  to={`/invoices/${invoice.docEntry}`}
                  className="flex items-center justify-between gap-4 py-3.5 first:pt-0 last:pb-0 hover:bg-muted/40"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">{invoice.invoiceNumber}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(invoice.docDate)} &middot; Due {formatDate(invoice.docDueDate)}
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-4">
                    <p className="text-sm font-semibold text-foreground">{formatCurrency(invoice.docTotal)}</p>
                    <StatusBadge status={invoice.status} variant="hero" />
                    {invoice.vertical && (
                      <Badge variant="outline" className="rounded-full border-purple-200 bg-purple-100 text-purple-700">
                        {invoice.vertical}
                      </Badge>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </QueryState>
  );
};