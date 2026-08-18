import { ErrorState } from "@/common/components/ErrorState";

export function InvoiceDetailError() {
  return (
    <ErrorState
      className="mx-auto max-w-6xl"
      message="Couldn't load this invoice. Please try again."
    />
  );
}