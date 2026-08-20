import type { BusinessPartner } from "@/types/business-partner.types";
import { Badge } from "@/common/components/ui/badge";
import { Building2, Mail, Phone } from "lucide-react";
import { getInitials } from "@/utils/common.utils";


interface BusinessPartnerHeaderProps {
  partner: BusinessPartner;
}

export const BusinessPartnerHeader = ({ partner }: BusinessPartnerHeaderProps) => {
  return (
    <div className="bp-animate relative overflow-hidden rounded-md bg-secondary p-8 text-white shadow-sm">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10 blur-2xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-24 h-24 w-24 rounded-full bg-white/5 blur-xl"
      />

      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/15 text-lg font-semibold ring-2 ring-white/25">
            {getInitials(partner.cardName) || <Building2 className="h-6 w-6" />}
          </div>

          <div>
            <Badge
              variant="outline"
              className="mb-2 rounded-full border-transparent bg-white/20 px-3 py-0.5 text-xs font-semibold text-white"
            >
              {partner.cardType}
            </Badge>

            <h1 className="text-3xl font-bold leading-tight">{partner.cardName}</h1>

            <p className="mt-1 text-sm text-white/75">
              Business Partner Code: {partner.cardCode}
            </p>
          </div>
        </div>

        {/* Quick actions — real, usable shortcuts rather than decoration */}
        <div className="relative flex flex-wrap gap-2">
          {partner.cellular && (
            <a
              href={`tel:${partner.cellular}`}
              className="inline-flex items-center gap-2 rounded-md bg-white/15 px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-white/25"
            >
              <Phone className="h-4 w-4" />
              Call
            </a>
          )}
          {partner.emailAddress && (
            <a
              href={`mailto:${partner.emailAddress}`}
              className="inline-flex items-center gap-2 rounded-md bg-white/15 px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-white/25"
            >
              <Mail className="h-4 w-4" />
              Email
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default BusinessPartnerHeader;