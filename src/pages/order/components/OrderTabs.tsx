import { SegmentedControl } from "@/common/components/SegmentedControl";
import type { TabFilter } from "@/types/order.types";

interface OrderTabsProps {
  value: TabFilter;
  onChange: (value: TabFilter) => void;
  allCount: number;
  openCount: number;
  closedCount: number;
}

const TAB_FILTERS: TabFilter[] = ["ALL", "OPEN", "CLOSED"];

export const OrderTabs = ({ value, onChange, allCount, openCount, closedCount }: OrderTabsProps) => (
  <div className="mb-4 flex items-center justify-between">
    <SegmentedControl
      options={TAB_FILTERS}
      value={value}
      onChange={onChange}
      counts={{ ALL: allCount, OPEN: openCount, CLOSED: closedCount }}
    />
  </div>
);