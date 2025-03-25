"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { DeleteTicketModal } from "./delete-ticket-modal";

interface DeleteTicketProps {
  ticketId: string;
  ticketName?: string;
}

export default function DeleteTicket({
  ticketId,
  ticketName,
}: DeleteTicketProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="destructive" onClick={() => setOpen(true)}>
        <div className="flex items-center gap-2">
          <span>Delete</span>
          <Trash
            className="opacity-60"
            size={16}
            strokeWidth={2}
            aria-hidden="true"
          />
        </div>
      </Button>

      <DeleteTicketModal
        open={open}
        onOpenChange={setOpen}
        ticketId={ticketId}
        ticketName={ticketName}
      />
    </>
  );
}
