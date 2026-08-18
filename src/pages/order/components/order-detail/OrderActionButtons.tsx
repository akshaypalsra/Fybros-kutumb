import { Button } from "@/common/components/ui/button";

interface OrderActionButtonsProps {
  onTrackPending?: () => void;
  onReorderCancelled?: () => void;
}

export const OrderActionButtons = ({ onTrackPending, onReorderCancelled }: OrderActionButtonsProps) => (
  <div className="flex gap-3">
    <Button className="flex-1 bg-secondary text-white hover:bg-secondary/90" onClick={onTrackPending}>
      Track Pending Items
    </Button>
    <Button
      variant="outline"
      className="flex-1 border-secondary text-secondary hover:bg-red-50"
      onClick={onReorderCancelled}
    >
      Reorder Cancelled Items
    </Button>
  </div>
);