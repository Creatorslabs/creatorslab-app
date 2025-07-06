import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/helpers/date-helpers";

interface Props {
  updatedAt?: Date;
  onClose: () => void;
}

export default function TaskModalFooter({
  updatedAt,
  onClose,
}: Props) {
  return (
    <div className="flex items-center justify-between pt-6 border-t border-border mt-6">
      <span className="text-sm text-gray-400">
        Last updated: {updatedAt ? formatDate(updatedAt) : "Recently"}
      </span>
      <div className="flex items-center gap-3">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
        <Button className="bg-primary hover:bg-primary/80">Edit Task</Button>
      </div>
    </div>
  );
}
