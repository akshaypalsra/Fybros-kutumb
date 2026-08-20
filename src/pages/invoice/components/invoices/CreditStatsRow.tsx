import { Receipt } from "lucide-react";
import { StatSummaryCard } from "@/common/components/StatSummaryCard";


export const CreditStatsRow = () => (
  <div className="mb-5 grid grid-cols-2 gap-4">
    <StatSummaryCard
      icon={<Receipt className="h-4 w-4 font-light" />}
      label="Total Credit"
      variant="accent"
      value={'₹ 2000'}
      sublabel="As on Today"
    />


    <StatSummaryCard
      icon={<Receipt className="h-4 w-4 font-light" />}
      label="Total Debit"
      variant="accent"
      value={'₹ 3000'}
      sublabel="As on Today"
    />


  </div>
);