import { useEffect, useState } from "react";
import { useBusinessPartnerApi } from "@/api/business/useBusinessPartnerApi";
import type { BusinessPartner } from "@/types/businessPartner.types";
import BusinessPartnerSkeleton from "./components/BusinessPartnerSkeleton";
import BusinessPartnerEmpty from "./components/BusinessPartnerEmpty";
import BusinessPartnerHeader from "./components/BusinessPartnerHeader";
import BusinessPartnerSummaryCards from "./components/BusinessPartnerSummaryCard";
import BusinessPartnerInfoCard from "./components/BusinessPartnerInfoCard";

const BusinessPartnerList = () => {
  const { getBusinessPartners } = useBusinessPartnerApi();

  const [partner, setPartner] = useState<BusinessPartner | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPartner = async () => {
      try {
        const data = await getBusinessPartners();
        setPartner(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadPartner();
  }, []);

  if (loading) return <BusinessPartnerSkeleton />;
  if (!partner) return <BusinessPartnerEmpty />;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <BusinessPartnerHeader partner={partner} />
      <BusinessPartnerSummaryCards partner={partner} />
      <BusinessPartnerInfoCard partner={partner} />
    </div>
  );
};

export default BusinessPartnerList;