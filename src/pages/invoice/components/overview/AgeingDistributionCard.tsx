
import type { AgeingBucketResponse } from "@/types/business-partner.types";
import { AgeingBar } from "../invoice/AgeingBar";

interface AgeingDistributionCardProps {
  ageingDistribution?: AgeingBucketResponse[];
}

export const AgeingDistributionCard = ({ ageingDistribution }: AgeingDistributionCardProps) => (
  <div className="rounded-md border bg-card p-6 shadow-sm lg:col-span-4">
    <p className="mb-4 text-sm font-medium text-muted-foreground">Ageing distribution (days)</p>
    <AgeingBar buckets={ageingDistribution ?? []} />
  </div>
);