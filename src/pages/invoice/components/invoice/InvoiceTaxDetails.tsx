interface InvoiceTaxDetailsProps {
  buyerGSTIN: string;
  irn: string;
}

export default function InvoiceTaxDetails({
  buyerGSTIN,
  irn,
}: InvoiceTaxDetailsProps) {
  return (
    <section className="rounded-md bg-card p-5 text-card-foreground">
      <div className="space-y-6">
        <div>
          <p className="text-sm font-normal text-muted-foreground">
            Buyer GSTIN
          </p>

          <p className="mt-1 break-all text-sm text-muted-foreground">
            {buyerGSTIN}
          </p>
        </div>

        <div>
          <p className="text-sm font-normal text-muted-foreground">
            IRN
          </p>

          <p className="mt-1 break-all text-sm leading-5 text-muted-foreground">
            {irn}
          </p>
        </div>
      </div>
    </section>
  );
}