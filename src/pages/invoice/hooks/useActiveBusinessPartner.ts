import { useQuery } from "@tanstack/react-query";
import { useBusinessPartnerApi } from "@/api/business/useBusinessPartnerApi";

export function useActiveBusinessPartner() {
  const { getBusinessPartners } = useBusinessPartnerApi();

  const { data: partner } = useQuery({
    queryKey: ["business-partner"],
    queryFn: () => getBusinessPartners(),
  });

  const businessPartnerId = partner?.cardCode ?? "";

  return {
    partner,
    businessPartnerId,
    enabled: !!businessPartnerId,
  };
}