import { SegmentedControl } from "@/common/components/SegmentedControl";
import { TAB_FILTERS } from "@/constants/Constants";
import type { TabFilter } from "@/types/order.types";

interface OrderTabsProps {
  value: TabFilter;
  onChange: (value: TabFilter) => void;
}



export const OrderTabs = ({ value, onChange }: OrderTabsProps) => (
  <div className="mb-4 flex items-center justify-between">
    <SegmentedControl
      className="text-lg"
      options={TAB_FILTERS}
      value={value}
      onChange={onChange}
    />
  </div>
);