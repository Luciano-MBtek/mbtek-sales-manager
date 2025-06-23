"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DealModalProps {
  dealId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function DealModal({ dealId, isOpen, onClose }: DealModalProps) {
  if (!dealId) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Deal Details</DialogTitle>
        </DialogHeader>
        <div className="py-2">
          <p className="text-sm text-muted-foreground">Deal ID: {dealId}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
