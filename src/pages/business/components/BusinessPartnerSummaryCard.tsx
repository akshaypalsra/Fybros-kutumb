import type { BusinessPartner } from "@/types/business-partner.types";
import { Card, CardContent } from "@/common/components/ui/card";
import { Building2, Calendar, CreditCard, Phone, type LucideIcon } from "lucide-react";
import { relativeTime } from "@/utils/business.utils";

interface SummaryItem {
  icon: LucideIcon;
  label: string;
  value: string;
  caption?: string | null;
}

interface BusinessPartnerSummaryCardsProps {
  partner: BusinessPartner;
}

export const BusinessPartnerSummaryCards = ({ partner }: BusinessPartnerSummaryCardsProps) => {
  const items: SummaryItem[] = [
    {
      icon: Building2,
      label: "Partner Code",
      value: partner.cardCode,
    },
    {
      icon: Phone,
      label: "Phone",
      value: partner.cellular,
    },
    {
      icon: CreditCard,
      label: "Credit Limit",
      value: `₹${partner.creditLimit.toLocaleString()}`,
    },
    {
      icon: Calendar,
      label: "Created",
      value: partner.createDate,
      caption: relativeTime(partner.createDate),
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item, i) => (
        <Card
          key={item.label}
          className="bp-animate rounded-md border-border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
          style={{ animationDelay: `${i * 60}ms` }}
        >
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-md bg-secondary/10 p-3 transition-colors duration-200">
              <item.icon className="h-5 w-5 text-secondary" />
            </div>

            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">{item.label}</p>
              <p className="truncate font-semibold text-foreground">{item.value}</p>
              {item.caption && (
                <p className="text-xs text-muted-foreground">{item.caption}</p>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default BusinessPartnerSummaryCards;