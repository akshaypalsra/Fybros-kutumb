import { Card, CardContent } from "@/common/components/ui/card";
import { Building2 } from "lucide-react";

export const BusinessPartnerEmpty = () => {
  return (
    <div className="mx-auto max-w-6xl">
      <Card className="rounded-xl border-border">
        <CardContent className="flex flex-col items-center gap-2 py-16 text-center">
          <Building2 className="h-8 w-8 text-muted-foreground/50" />
          <p className="font-medium text-foreground">No business partner found</p>
          <p className="text-sm text-muted-foreground">
            Once a partner record exists, its details will appear here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessPartnerEmpty;