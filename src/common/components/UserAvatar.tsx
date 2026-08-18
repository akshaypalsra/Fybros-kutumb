import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/common/components/ui/avatar";
import { cn, getInitials } from "@/utils/common.utils";

interface UserAvatarProps {
  name: string | undefined;
  imageUrl?: string;
  className?: string;
  fallbackClassName?: string;
  fallbackVariant?: "initials" | "first-letter";
}

export function UserAvatar({
  name,
  imageUrl,
  className,
  fallbackClassName,
  fallbackVariant = "initials",
}: UserAvatarProps) {
  const safeName = name ?? "?";
  const fallbackText =
    fallbackVariant === "first-letter"
      ? safeName.charAt(0)
      : getInitials(safeName);

  return (
    <Avatar className={cn("h-9 w-9", className)}>
      {imageUrl && <AvatarImage src={imageUrl} alt={safeName} />}
      <AvatarFallback className={fallbackClassName}>
        {fallbackText}
      </AvatarFallback>
    </Avatar>
  );
}