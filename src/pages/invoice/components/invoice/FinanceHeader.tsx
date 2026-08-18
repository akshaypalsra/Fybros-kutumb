import { TABS } from "@/constants/Constants";
import type { Tab } from "@/types/invoice.types";
import { Bell } from "lucide-react";
import { Button } from "@/common/components/ui/button";
import { SegmentedControl } from "@/common/components/SegmentedControl";
import { IdentityHeader } from "@/common/components/IdentityHeader";


export const FinanceHeader = ({
  activeTab,
  onTabChange,
}: {
  partnerName: string;
  partnerCode: string;
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}) => (
  <div className="mb-6 flex items-center justify-between">
    <IdentityHeader showAvatar={false} name='Invoices' subtitle='View and manage all your invoices' />
    <div className="flex items-center gap-6">
      <SegmentedControl
        variant="underline"
        options={TABS.map((t) => t.key)}
        value={activeTab}
        onChange={onTabChange}
        getLabel={(key) => TABS.find((t) => t.key === key)?.label ?? key}
      />

      <Button
        type="button"
        variant="outline"
        size="icon"
        aria-label="Notifications"
        className="relative h-10 w-10 rounded-full bg-background hover:bg-muted"
      >
        <Bell className="h-4 w-4" />
        <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-secondary" />
      </Button>
    </div>
  </div>
);