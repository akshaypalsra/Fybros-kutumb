import { ArrowLeft, Download } from "lucide-react";
import { Button } from "@/common/components/ui/button";

interface OrderDetailHeaderProps {
  onBack: () => void;
  onDownload?: () => void;
}

export const OrderDetailHeader = ({ onBack, onDownload }: OrderDetailHeaderProps) => (
  <div className="mb-6 flex items-center justify-between">
    <div className="flex items-center gap-3">
      <Button variant="ghost" size="icon" onClick={onBack}>
        <ArrowLeft className="h-4 w-4" />
      </Button>
      <h1 className="text-xl font-medium tracking-tight text-foreground">Order Detail</h1>
    </div>
    <Button variant="outline" size="icon" onClick={onDownload}>
      <Download className="h-4 w-4" />
    </Button>
  </div>
);