// src/common/components/DetailPageHeader.tsx
import { ArrowLeft, Download, Loader2 } from "lucide-react";
import { Button } from "@/common/components/ui/button";
import { IdentityHeader } from "./IdentityHeader";

interface DetailPageHeaderProps {
  title: string;
  subtitle?: string;
  onBack: () => void;
  onDownload?: () => void;
  isDownloading?: boolean;
}

export const DetailPageHeader = ({ title, subtitle, onBack, onDownload, isDownloading }: DetailPageHeaderProps) => (
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
      disabled={isDownloading}
      className="gap-2 rounded-md bg-secondary hover:bg-secondary/90 dark:hover:bg-secondary/90 hover:text-white text-white dark:bg-secondary dark:text-white"
    >
      {isDownloading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Download className="h-4 w-4" />
      )}
      {isDownloading ? "Preparing..." : "Download"}
    </Button>
  </div>
);