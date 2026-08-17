import { StatusChip } from "@/common/components/StatusChip";
import { STATUS_RAIL } from "@/utils/orders.utils";



interface StatusPillProps {
  status: string | null | undefined;
}

export const StatusPill = ({ status }: StatusPillProps) => (
  <StatusChip
    status={status}
    styleMap={STATUS_RAIL}
    baseClassName="rounded-full border-0 px-2.5 py-0.5 text-[10.5px] font-bold tracking-wide capitalize"
  />
);