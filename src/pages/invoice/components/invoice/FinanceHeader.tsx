import { TABS } from "@/constants/Constants";
import type { Tab } from "@/types/invoice.types";
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
}) => {
  const activeTabData = TABS.find((t) => t.key === activeTab);

  return (
    <div className="mb-6 flex flex-col ">
      <SegmentedControl
        variant="underline"
        options={TABS.map((t) => t.key)}
        value={activeTab}
        onChange={onTabChange}
        getLabel={(key) => TABS.find((t) => t.key === key)?.label ?? key}
      />

<div className="mt-5">
<IdentityHeader
        showAvatar={false}
        name={activeTabData?.label ?? ""}
        subtitle={activeTabData?.subtitle ?? ""}
      />
</div>
      
    </div>
  );
};