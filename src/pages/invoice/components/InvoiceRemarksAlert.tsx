import { AlertCircle } from "lucide-react"

export const InvoiceRemarksAlert = ({ remarks }: { remarks: string }) => (
  <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-secondary">
    <AlertCircle className="mt-0.5 h-4 w-4 flex-none" />
    <p>
      <span className="font-medium">Remarks:</span> {remarks}
    </p>
  </div>
)