import { Bell, Search } from "lucide-react";

interface HomeHeaderProps {
  cardName?: string;
  cardCode?: string;
}

export const HomeHeader = ({
  cardName,
  cardCode,
}: HomeHeaderProps) => {
  const displayName = cardName || "Account";

  return (
    <header className="flex items-center justify-between py-4">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-destructive/10 text-lg font-semibold text-destructive">
          {displayName[0]?.toUpperCase() ?? "A"}
        </div>

        <div>
          <p className="text-base font-semibold text-foreground">
            {cardName}
          </p>

          <p className="text-xs text-muted-foreground">
            {cardCode}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          aria-label="Search"
          className="text-foreground"
        >
          <Search className="h-5 w-5" />
        </button>

        <button
          type="button"
          aria-label="Notifications"
          className="relative text-foreground"
        >
          <Bell className="h-5 w-5" />

          <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-destructive ring-2 ring-background" />
        </button>
      </div>
    </header>
  );
};