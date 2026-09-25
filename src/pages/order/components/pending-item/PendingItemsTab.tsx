import { useEffect, useState } from "react";
import { useInfiniteScrollTrigger } from "@/hooks/useInfiniteScrollTrigger";
import { QueryState } from "@/wrapper/QueryState";
import { ErrorState } from "@/common/components/ErrorState";
import { EmptyState } from "@/common/components/EmptyState";
import type { PendingItem } from "@/types/pending-item.types";
import { usePendingItemsData } from "../../hooks/usePendingItemsData";
import { OrdersListSkeleton } from "../order/OrdersListSkeleton";
import { PendingItemsList } from "./PendingItemsList";
import { PendingItemDetailPanel } from "./PendingItemDetailPanel";
import PendingItemDetailPanelSkeleton from "./PendingItemDetailPanelSkeleton";


interface PendingItemsTabProps {
  query: string;
  dateFrom: string;
  dateTo: string;
  selectedVerticals: string[];
}

export const PendingItemsTab = ({ query, dateFrom, dateTo, selectedVerticals }: PendingItemsTabProps) => {
  const [selectedItem, setSelectedItem] = useState<PendingItem | null>(null);

  const {
    pendingItems,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = usePendingItemsData({ query, dateFrom, dateTo, selectedVerticals });

  const sentinelRef = useInfiniteScrollTrigger(
    () => fetchNextPage(),
    !!hasNextPage && !isFetchingNextPage,
  );

  useEffect(() => {
    if (isLoading) return;

    if (pendingItems.length === 0) {
      setSelectedItem(null);
      return;
    }

    const selectionStillValid = pendingItems.some((item) => item.itemCode === selectedItem?.itemCode);

    if (!selectedItem || !selectionStillValid) {
      setSelectedItem(pendingItems[0]);
    }
  }, [pendingItems, isLoading]);

  return (
    <QueryState<PendingItem[]>
      isLoading={isLoading}
      isError={isError}
      data={pendingItems}
      loading={
  <div className="flex gap-6">
    <div className="w-[60%]">
      <OrdersListSkeleton rows={5} />
    </div>
    <div className="w-[40%]">
      <PendingItemDetailPanelSkeleton />
    </div>
  </div>
}
      error={<ErrorState message="Failed to load pending items. Please try again." />}
      isEmpty={(data) => data.length === 0}
      empty={<EmptyState message="No pending items match with filters." />}
    >
      {() => (
        <div className="flex gap-6">
          <div className="w-[60%]">
            <PendingItemsList
              items={pendingItems}
              selectedItemId={selectedItem?.itemCode}
              onItemClick={setSelectedItem}
            />
            <div ref={sentinelRef} className="h-1" />
            {isFetchingNextPage && <OrdersListSkeleton rows={2} />}
          </div>

          {selectedItem && (
            <div className="w-[40%]">
              <PendingItemDetailPanel item={selectedItem} />
            </div>
          )}
        </div>
      )}
    </QueryState>
  );
};