import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ConfirmOptions {
  title?: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "danger";
}

export function useConfirm() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions>({
    title: "Are you sure?",
    description: "",
    confirmText: "Confirm",
    cancelText: "Cancel",
    variant: "default",
  });

  const [promiseCallback, setPromiseCallback] = useState<{
    resolve: (value: boolean) => void;
  } | null>(null);

  const confirm = (opts: ConfirmOptions): Promise<boolean> => {
    setOptions({
      title: opts.title || "Are you sure?",
      description: opts.description,
      confirmText: opts.confirmText || "Confirm",
      cancelText: opts.cancelText || "Cancel",
      variant: opts.variant || "default",
    });
    setIsOpen(true);

    return new Promise((resolve) => {
      setPromiseCallback({ resolve });
    });
  };

  const handleConfirm = () => {
    if (promiseCallback) {
      setLoading(true);
      promiseCallback.resolve(true);
      setIsOpen(false);
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (promiseCallback) {
      promiseCallback.resolve(false);
      setIsOpen(false);
    }
  };

  const ConfirmModal = () => (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogDescription className="sr-only" />
      <DialogContent className="bg-card-box border-border text-foreground max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {options.title}
          </DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground mt-2">
          {options.description}
        </p>

        <div className="flex justify-end gap-3 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            className="border-border text-muted-foreground hover:bg-gray-700"
            disabled={loading}
          >
            {options.cancelText}
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            className={cn(
              "text-foreground",
              options.variant === "danger"
                ? "bg-red-600 hover:bg-red-700"
                : "bg-primary hover:bg-secondary"
            )}
          >
            {loading ? "Processing..." : options.confirmText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  return { confirm, ConfirmModal };
}
