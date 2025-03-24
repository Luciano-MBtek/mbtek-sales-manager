"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CreateTicketModal } from "@/components/Ticket/create-ticket-modal";

export default function OpenTicket() {
  const [open, setOpen] = useState(false);

  const handleSubmit = (data: any) => {
    console.log("Ticket data:", data);
    // Aquí puedes implementar la lógica para enviar los datos a HubSpot
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="bg-[#00bdb4] hover:bg-[#00a59e]"
      >
        Open Ticket
      </Button>

      <CreateTicketModal
        open={open}
        onOpenChange={setOpen}
        onSubmit={handleSubmit}
      />
    </>
  );
}
