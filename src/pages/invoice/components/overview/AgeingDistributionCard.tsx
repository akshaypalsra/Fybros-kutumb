
import type { AgeingBucketResponse } from "@/types/business-partner.types";
import { AgeingBar } from "../invoice/AgeingBar";
import { Heading } from "@/common/components/Heading";

interface AgeingDistributionCardProps {
  ageingDistribution?: AgeingBucketResponse[];
}

export const AgeingDistributionCard = ({ ageingDistribution }: AgeingDistributionCardProps) => (
  <div className="rounded-md border bg-card px-6 py-3 shadow-sm lg:col-span-4">
     <Heading title='Aging (days)'/>
    <AgeingBar buckets={ageingDistribution ?? []} />
  </div>
);