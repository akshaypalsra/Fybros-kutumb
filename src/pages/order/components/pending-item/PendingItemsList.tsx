import type { PendingItem } from "@/types/pending-item.types";
import { PendingItemRow } from "./PendingItemRow";

interface PendingItemsListProps {
  items: PendingItem[];

}

export const PendingItemsList = ({ items }: PendingItemsListProps) => {
  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => (
        <PendingItemRow key={item.itemCode} item={item}/>
      ))}
    </div>
  );
};