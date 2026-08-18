// pages/home/components/HomeHeader.tsx
import { IdentityHeader } from "@/common/components/IdentityHeader";
import { Button } from "@/common/components/ui/button";
import { Bell } from "lucide-react";

interface HomeHeaderProps {
  cardName?: string;
  cardCode?: string;
}

export const HomeHeader = ({ cardName, cardCode }: HomeHeaderProps) => {
  return (
    <header className="flex items-center justify-between mb-6 ">
      <IdentityHeader name={cardName} subtitle={cardCode} showAvatar={true} />

      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Notifications"
          className="relative h-9 w-9 text-foreground"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-destructive ring-2 ring-background" />
        </Button>
      </div>
    </header>
  );
};