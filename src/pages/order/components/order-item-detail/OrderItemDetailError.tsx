import { ErrorState } from "@/common/components/ErrorState";

export function OrderItemDetailError() {
  return (
    <ErrorState
      className="mx-auto max-w-6xl"
      message="Couldn't load this item. Please try again."
    />
  );
}