import type { ReactNode } from "react";

interface ListStateWrapperProps<T> {
  isLoading: boolean;
  isError: boolean;
  data: T[] | undefined;
  skeleton: ReactNode;
  error: ReactNode;
  children: (data: T[]) => ReactNode;
}

export function ListStateWrapper<T>({
  isLoading,
  isError,
  data,
  skeleton,
  error,
  children,
}: ListStateWrapperProps<T>) {
  if (isLoading) {
    return <>{skeleton}</>;
  }

  if (isError || !data) {
    return <>{error}</>;
  }

  return <>{children(data)}</>;
}