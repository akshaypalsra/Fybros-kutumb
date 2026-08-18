import type { ReactNode } from "react";

interface QueryStateWrapperProps<T> {
    isLoading: boolean;
    isError: boolean;
    data: T | null | undefined;
    skeleton: ReactNode;
    error: ReactNode;
    children: (data: T) => ReactNode;
}

export function QueryStateWrapper<T>({
    isLoading,
    isError,
    data,
    skeleton,
    error,
    children,
}: QueryStateWrapperProps<T>) {
    if (isLoading) {
        return <>{skeleton}</>;
    }

    if (isError || !data) {
        return <>{error}</>;
    }

    return <>{children(data)}</>;
}