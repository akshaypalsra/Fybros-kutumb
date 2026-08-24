
import type { AgeingBucketResponse } from "@/types/business-partner.types";
import { AgeingBar } from "../invoice/AgeingBar";

interface AgeingDistributionCardProps {
  ageingDistribution?: AgeingBucketResponse[];
}

export const AgeingDistributionCard = ({ ageingDistribution }: AgeingDistributionCardProps) => (
  <div className="rounded-md border bg-card px-6 py-3 shadow-sm lg:col-span-2">
    <p className="mb-4 text-sm font-medium text-muted-foreground">Ageing (days)</p>
    <AgeingBar buckets={ageingDistribution ?? []} />
  </div>
);