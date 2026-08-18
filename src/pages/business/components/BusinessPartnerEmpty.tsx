import { Building2 } from "lucide-react";
import { EmptyState } from "@/common/components/EmptyState";

export const BusinessPartnerEmpty = () => {
  return (
    <EmptyState
      className="mx-auto max-w-6xl py-16"
      icon={Building2}
      title="No business partner found"
      message="Once a partner record exists, its details will appear here."
    />
  );
};

export default BusinessPartnerEmpty;