import { useQuery } from "@tanstack/react-query";
import { useBusinessPartnerApi } from "@/api/business/useBusinessPartnerApi";
import type { BusinessPartner } from "@/types/business-partner.types";
import BusinessPartnerSkeleton from "./components/BusinessPartnerSkeleton";
import BusinessPartnerEmpty from "./components/BusinessPartnerEmpty";
import BusinessPartnerHeader from "./components/BusinessPartnerHeader";
import BusinessPartnerSummaryCards from "./components/BusinessPartnerSummaryCard";
import BusinessPartnerInfoCard from "./components/BusinessPartnerInfoCard";
import { QueryState } from "@/wrapper/QueryState";

const BusinessPartnerList = () => {
  const { getBusinessPartners } = useBusinessPartnerApi();

  const {
    data: partner,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["businessPartner"],
    queryFn: getBusinessPartners,
  });

  return (
    <QueryState<BusinessPartner>
      isLoading={isLoading}
      isError={isError}
      data={partner}
      loading={<BusinessPartnerSkeleton />}
      error={<BusinessPartnerEmpty />}
    >
      {(partner) => (
        <div className="mx-auto max-w-6xl space-y-6">
          <BusinessPartnerHeader partner={partner} />
          <BusinessPartnerSummaryCards partner={partner} />
          <BusinessPartnerInfoCard partner={partner} />
        </div>
      )}
    </QueryState>
  );
};

export default BusinessPartnerList;