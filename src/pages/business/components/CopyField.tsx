import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/common/components/ui/button";

interface CopyFieldProps {
  value?: string | null;
}

export const CopyField = ({ value }: CopyFieldProps) => {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  if (!value) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      timeoutRef.current = setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard write failed silently — no user-facing error needed here
    }
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={handleCopy}
      aria-label={copied ? "Copied" : `Copy ${value}`}
      className="group/copy h-auto w-auto rounded-md p-1 text-muted-foreground opacity-0 transition-all duration-150 hover:bg-secondary/10 hover:text-secondary focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-secondary/40 group-hover:opacity-100"
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
    </Button>
  );
};

export default CopyField;