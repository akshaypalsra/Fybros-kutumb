import { useEffect, useState } from "react";
import { Receipt } from "lucide-react";
import { StatSummaryCard } from "@/common/components/StatSummaryCard";

import { formatCompactCurrency } from "@/utils/common.utils";
import type { LedgerStats } from "@/types/ledger.types";
import { useLedgerApi } from "@/api/transaction/useTransactionApi";

interface CreditStatsRowProps {
  businessPartnerId: string;
}

export const CreditStatsRow = ({ businessPartnerId }: CreditStatsRowProps) => {
  const { getBusinessPartnerLedgerStats } = useLedgerApi();
  const [stats, setStats] = useState<LedgerStats>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchStats = async () => {
      setIsLoading(true);
      try {
        const data = await getBusinessPartnerLedgerStats({ businessPartnerId });
        if (isMounted) setStats(data);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchStats();

    return () => {
      isMounted = false;
    };
  }, [businessPartnerId]);

  return (
    <div className="mb-5 grid grid-cols-4 gap-3">
      <StatSummaryCard
        icon={<Receipt className="h-4 w-4 font-light" />}
        label="Total Credit"
        variant="accent"
        value={isLoading ? "—" : formatCompactCurrency(stats?.totalCredit)}
        sublabel="As on Today"
      />

      <StatSummaryCard
        icon={<Receipt className="h-4 w-4 font-light" />}
        label="Total Debit"
        variant="accent"
        value={isLoading ? "—" : formatCompactCurrency(stats?.totalDebit)}
        sublabel="As on Today"
      />
    </div>
  );
};