import type { ReactNode } from "react";

interface LoadingEmptyContentProps {
  isLoading: boolean;
  isEmpty: boolean;
  loadingState: ReactNode;
  emptyState: ReactNode;
  children: ReactNode;
}

export function LoadingEmptyContent({
  isLoading,
  isEmpty,
  loadingState,
  emptyState,
  children,
}: LoadingEmptyContentProps) {
  if (isLoading) return <>{loadingState}</>;
  if (isEmpty) return <>{emptyState}</>;
  return <>{children}</>;
}