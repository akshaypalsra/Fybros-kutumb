import { ErrorState } from "@/common/components/ErrorState";

export function OrdersListError() {
  return <ErrorState message="Failed to load orders. Please try again." />;
}