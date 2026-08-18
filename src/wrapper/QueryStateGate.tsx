import type { ReactNode } from "react";

interface QueryStateGateProps {
  isLoading: boolean;
  isError: boolean;
  skeleton: ReactNode;
  error: ReactNode;
  children: ReactNode;
}

export function QueryStateGate({ isLoading, isError, skeleton, error, children }: QueryStateGateProps) {
  if (isLoading) return <>{skeleton}</>;
  if (isError) return <>{error}</>;
  return <>{children}</>;
}