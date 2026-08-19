import { useQuery } from "@tanstack/react-query";
import { useBusinessPartnerApi } from "@/api/business/useBusinessPartnerApi";
import type { OutstandingSummary } from "@/types/businessPartner.types";

export function useOutstandingSummary(businessPartnerId: string, enabled: boolean) {
    const { getOutstandingSummary } = useBusinessPartnerApi();

    return useQuery<OutstandingSummary>({
        queryKey: ["outstanding-summary", businessPartnerId],
        queryFn: () => getOutstandingSummary(),
        enabled,
    });
}