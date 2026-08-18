import type { ReactNode } from "react";

type QueryStateProps<T> =
  | {
    isLoading: boolean;
    isError: boolean;
    data?: T;
    loading: ReactNode;
    error: ReactNode;
    isEmpty?: (data: T) => boolean;
    empty?: ReactNode;
    children: (data: T) => ReactNode;
  }
  | {
    isLoading: boolean;
    isError: boolean;
    data?: never;
    loading: ReactNode;
    error: ReactNode;
    isEmpty?: never;
    empty?: never;
    children: ReactNode;
  };

export function QueryState<T>(props: QueryStateProps<T>) {
  const { isLoading, isError, loading, error } = props;

  if (isLoading) return <>{loading}</>;
  if (isError) return <>{error}</>;

  if (typeof props.children !== "function") {
    return <>{props.children}</>;
  }

  const { data, isEmpty, empty, children } = props;

  if (data === null || data === undefined) {
    return <>{error}</>;
  }

  if (isEmpty && empty && isEmpty(data)) {
    return <>{empty}</>;
  }

  return <>{children(data)}</>;
}