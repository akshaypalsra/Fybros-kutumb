import { ErrorState } from "@/common/components/ErrorState";

export function OrderDetailError() {
  return <ErrorState message="Couldn't load this order. Please try again." />;
}