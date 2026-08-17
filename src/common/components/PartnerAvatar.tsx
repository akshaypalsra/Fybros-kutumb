import { Avatar, AvatarFallback } from "@/common/components/ui/avatar";
import { cn } from "@/utils/invoice.utils";

interface PartnerAvatarProps {
  partnerName: string | undefined;
  className?: string;
}

export const PartnerAvatar = ({ partnerName, className }: PartnerAvatarProps) => (
  <Avatar className={cn("h-11 w-11", className)}>
    <AvatarFallback className="bg-secondary/10 text-lg font-bold text-secondary">
      {(partnerName ?? "?").charAt(0)}
    </AvatarFallback>
  </Avatar>
);