"use client";

import { useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { deleteTicket } from "@/actions/deleteTicket";

interface DeleteTicketModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ticketId: string;
  ticketName?: string;
}

export function DeleteTicketModal({
  open,
  onOpenChange,
  ticketId,
  ticketName = "this ticket",
}: DeleteTicketModalProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const handleDelete = async () => {
    if (!ticketId) {
      toast({
        title: "Error",
        description: "No ticket ID provided",
        variant: "destructive",
      });
      return;
    }

    try {
      startTransition(async () => {
        const result = await deleteTicket(ticketId);

        if (result.success) {
          toast({
            title: "Success",
            description: "Ticket deleted successfully",
          });
          onOpenChange(false);
        } else {
          toast({
            title: "Error",
            description: result.error || "Failed to delete ticket",
            variant: "destructive",
          });
        }
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to delete ticket",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-xl font-medium text-red-600 flex items-center gap-2">
            <Trash size={20} />
            Delete Ticket
          </DialogTitle>
          <DialogDescription className="pt-2">
            Are you sure you want to delete ticket:{" "}
            <span className="text-primary font-bold">{ticketName}</span>? This
            action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="pt-4 flex gap-2 justify-end">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? (
              <>
                <span className="mr-2">
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </span>
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
