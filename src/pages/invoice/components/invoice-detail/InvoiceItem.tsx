import { useEffect, useState } from "react";
import { useInvoiceApi } from "@/api/invoice/useInvoiceApi";
import { formatCurrency } from "@/utils/common.utils";
import type { InvoiceItem } from "@/types/invoice.types";

interface InvoiceItemsTableProps {
    invoiceId: string;

}

export const InvoiceItemsTable = ({ invoiceId }: InvoiceItemsTableProps) => {
    const { getInvoiceItems } = useInvoiceApi();
    const [items, setItems] = useState<InvoiceItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const fetchItems = async () => {
            setIsLoading(true);
            setError(false);
            try {
                const data = await getInvoiceItems(invoiceId);
                if (isMounted) setItems(data);
            } catch {
                if (isMounted) setError(true);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        fetchItems();

        return () => {
            isMounted = false;
        };

    }, [invoiceId]);

    return (
        <div className="bg-card p-5 rounded-md">
            <h2 className="mb-4 text-sm font-semibold text-foreground">Item Details</h2>

            {isLoading && <p className="text-sm text-muted-foreground">Loading items…</p>}

            {!isLoading && error && (
                <p className="text-sm text-destructive">Failed to load invoice items.</p>
            )}

            {!isLoading && !error && items.length === 0 && (
                <p className="text-sm text-muted-foreground">No items found for this invoice.</p>
            )}

            {!isLoading && !error && items.length > 0 && (
                <div >
                    {items.map((item) => (
                        <div key={item.id} className="p-5  bg-muted rounded-md my-2 ">
                            <div className="flex items-start justify-between gap-3">
                                <p className="font-semibold text-foreground">{item.itemCode}</p>
                                <p className="font-semibold text-foreground">{formatCurrency(item.lineTotal)}</p>
                            </div>

                            <div className="mt-1 flex items-start justify-between gap-3">
                                <p className="text-sm text-foreground/80">{item.itemDescription}</p>
                                {item.hsnCode && (
                                    <span className="shrink-0 whitespace-nowrap rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                                        HSN {item.hsnCode}
                                    </span>
                                )}
                            </div>

                            <p className="mt-2 text-sm text-muted-foreground">
                                {item.quantity} {item.measureUnit} | {formatCurrency(item.price)} each
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};