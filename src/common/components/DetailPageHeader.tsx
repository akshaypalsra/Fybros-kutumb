// src/common/components/DetailPageHeader.tsx
import { ArrowLeft, Download } from "lucide-react";
import { Button } from "@/common/components/ui/button";
import { IdentityHeader } from "./IdentityHeader";

interface DetailPageHeaderProps {
  title: string;
  subtitle?: string;
  onBack: () => void;
  onDownload?: () => void;
}

export const DetailPageHeader = ({ title, subtitle, onBack, onDownload }: DetailPageHeaderProps) => (
  <div className="mb-6 flex items-center justify-between border-b border-border pb-4">
    <div className="flex items-center gap-3">
      <Button
        variant="ghost"
        size="icon"
        onClick={onBack}
        aria-label="Go back"
        className="shrink-0"
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>
      <IdentityHeader showAvatar={false} name={title} subtitle={subtitle} />
    </div>
    <Button
      variant="outline"
      onClick={onDownload}
      disabled={!onDownload}
      className="gap-2"
    >
      <Download className="h-4 w-4" />
      Download
    </Button>
  </div>
);