import type { BusinessPartner } from "@/types/businessPartner.types";
import { Badge } from "@/common/components/ui/badge";
import { Card, CardContent } from "@/common/components/ui/card";
import { Separator } from "@/common/components/ui/separator";
import { Building2, Mail, MapPin, Phone } from "lucide-react";
import CopyField from "./CopyField";


interface BusinessPartnerInfoCardProps {
  partner: BusinessPartner;
}

export const BusinessPartnerInfoCard = ({ partner }: BusinessPartnerInfoCardProps) => {
  return (
    <Card className="bp-animate rounded-xl border-border" style={{ animationDelay: "240ms" }}>
      <CardContent className="space-y-6 p-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-foreground">Business Information</h2>
          </div>
          <Separator className="mt-3" />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="flex gap-4">
            <MapPin className="mt-1 h-5 w-5 shrink-0 text-secondary" />

            <div>
              <p className="text-sm font-medium text-foreground">Address</p>
              <p className="text-sm text-muted-foreground">{partner.address}</p>
              <p className="text-sm text-muted-foreground">
                {partner.city}, {partner.county}
              </p>
              <p className="text-sm text-muted-foreground">
                {partner.country} - {partner.zipCode}
              </p>
            </div>
          </div>

          <div className="group flex items-center gap-4">
            <Mail className="h-5 w-5 shrink-0 text-secondary" />

            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground">Email</p>
              <p className="truncate text-sm text-muted-foreground">
                {partner.emailAddress ?? "Not available"}
              </p>
            </div>

            <CopyField value={partner.emailAddress} />
          </div>

          <div className="group flex items-center gap-4">
            <Phone className="h-5 w-5 shrink-0 text-secondary" />

            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground">Contact Number</p>
              <p className="text-sm text-muted-foreground">{partner.cellular}</p>
            </div>

            <CopyField value={partner.cellular} />
          </div>

          <div className="flex gap-4">
            <Building2 className="mt-1 h-5 w-5 shrink-0 text-secondary" />

            <div>
              <p className="text-sm font-medium text-foreground">Partner Type</p>
              <Badge
                variant="outline"
                className="mt-1 rounded-full border-transparent bg-secondary/10 px-3 py-0.5 text-xs font-semibold text-secondary"
              >
                {partner.cardType}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BusinessPartnerInfoCard;