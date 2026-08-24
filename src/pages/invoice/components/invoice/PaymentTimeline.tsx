interface Payment {
    id: string;
    date: string;
    amount: number;
}

interface PaymentTimelineProps {
    payments: Payment[];
}

const formatCurrency = (value: number) =>
    `₹ ${value.toLocaleString("en-IN")}`;

export default function PaymentTimeline({
    payments,
}: PaymentTimelineProps) {
    return (
        <section className="rounded-md bg-card p-5 text-card-foreground">
            <h2 className="mb-4 text-sm font-semibold text-foreground">
                Payment Timeline
            </h2>

            <div className="space-y-3">
                {payments.map((payment) => (
                    <div
                        key={payment.id}
                        className="flex items-center justify-between rounded-md  bg-muted px-3 py-3"
                    >
                        <div className="flex items-center gap-3">
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted-foreground/60">
                                <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="text-background"
                                >
                                    <path
                                        d="M4 7.5C4 6.67 4.67 6 5.5 6H18.5C19.33 6 20 6.67 20 7.5V16.5C20 17.33 19.33 18 18.5 18H5.5C4.67 18 4 17.33 4 16.5V7.5Z"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                    />
                                    <path
                                        d="M4 9H20"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                    />
                                    <path
                                        d="M7 14H10"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                    />
                                </svg>
                            </div>

                            <div>
                                <p className="text-sm font-heading font-medium text-foreground">
                                    {payment.id}
                                </p>

                                <p className="mt-0.5 text-xs text-muted-foreground">
                                    {payment.date}
                                </p>
                            </div>
                        </div>

                        <span className="text-sm font-heading font-medium text-foreground">
                            {formatCurrency(payment.amount)}
                        </span>
                    </div>
                ))}
            </div>
        </section>
    );
}