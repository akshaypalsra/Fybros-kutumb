interface DetailFieldProps {
  label: string
  value: React.ReactNode
}

export const DetailField = ({ label, value }: DetailFieldProps) => (
  <div>
    <p className="text-xs text-muted-foreground">{label}</p>
    <p className="text-sm font-medium text-foreground">{value ?? "—"}</p>
  </div>
)