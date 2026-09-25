import type { PendingItem } from "@/types/pending-item.types";
import { PendingItemRow } from "./PendingItemRow";

interface PendingItemsListProps {
  items: PendingItem[];
  selectedItemId?: string;
  onItemClick?: (item: PendingItem) => void;
}

export const PendingItemsList = ({ items, selectedItemId, onItemClick }: PendingItemsListProps) => {
  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => (
        <PendingItemRow
          key={item.itemCode}
          item={item}
          isSelected={item.itemCode === selectedItemId}
          onClick={onItemClick}
        />
      ))}
    </div>
  );
};