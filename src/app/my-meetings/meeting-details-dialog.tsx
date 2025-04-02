"use client";

import { format } from "date-fns";
import {
  CalendarIcon,
  MapPin,
  Clock,
  FileText,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Meeting } from "@/types/meetingTypes";
import { CalendarEvent } from "@/types/calendarTypes";
import { useState, useTransition } from "react";
import { deleteMeeting } from "@/actions/deleteMeeting";
import { toast } from "@/components/ui/use-toast";

interface MeetingDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  meeting?: Meeting;
  calendarEvent?: CalendarEvent;
}

export function MeetingDetailsDialog({
  open,
  onOpenChange,
  meeting,
  calendarEvent,
}: MeetingDetailsDialogProps) {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [isPending, startTransition] = useTransition();
  if (!meeting || !calendarEvent) return null;

  const outcome = meeting.properties.hs_meeting_outcome;

  // Helper function to get outcome badge color
  const getOutcomeBadgeVariant = (outcome?: string) => {
    switch (outcome) {
      case "COMPLETED":
        return "success";
      case "SCHEDULED":
        return "default";
      case "RESCHEDULED":
        return "warning";
      case "NO_SHOW":
        return "destructive";
      case "CANCELED":
        return "outline";
      default:
        return "secondary";
    }
  };
  const handleDelete = () => {
    const meetingId = meeting.id;
    const googleMeetingId = meeting.properties.hs_meeting_change_id;
    const title = meeting.properties.hs_meeting_title;

    startTransition(async () => {
      try {
        const result = await deleteMeeting(
          meetingId,
          googleMeetingId ? googleMeetingId : ""
        );

        if (result.error) {
          toast({
            title: "Error deleting meeting",
            description: <p className="text-secondary">{result.error}</p>,
            variant: "destructive",
          });
          onOpenChange(false);
        } else {
          toast({
            title: `Deleted successfully`,
            description: (
              <p className="text-primary">Meeting: {title} deleted</p>
            ),
          });

          // Solo cerramos el modal después de un borrado exitoso
          onOpenChange(false);

          // Forzamos un refresh de la página para mostrar los cambios
          window.location.reload();
        }
      } catch (error) {
        toast({
          title: "Error deleting meeting",
          description: (
            <p className="text-secondary">
              {error instanceof Error ? error.message : "Unknown error"}
            </p>
          ),
          variant: "destructive",
        });
        onOpenChange(false);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {meeting.properties.hs_meeting_title || "Untitled Meeting"}
          </DialogTitle>
          <DialogDescription className="flex items-center gap-2">
            Outcome:
          </DialogDescription>
          {outcome && (
            <div>
              <Badge variant={getOutcomeBadgeVariant(outcome)}>
                {outcome.charAt(0) + outcome.slice(1).toLowerCase()}
              </Badge>
            </div>
          )}
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="flex items-start gap-3">
            <CalendarIcon className="h-5 w-5 mt-0.5 text-muted-foreground" />
            <div>
              <p className="font-medium">Date & Time</p>
              <p className="text-sm text-muted-foreground">
                {meeting.properties.hs_meeting_start_time &&
                  format(
                    new Date(meeting.properties.hs_meeting_start_time),
                    "PPP"
                  )}
              </p>
              <p className="text-sm text-muted-foreground">
                {meeting.properties.hs_meeting_start_time &&
                  meeting.properties.hs_meeting_end_time &&
                  `${format(new Date(meeting.properties.hs_meeting_start_time), "h:mm a")} - 
                   ${format(new Date(meeting.properties.hs_meeting_end_time), "h:mm a")}`}
              </p>
              <p className="text-sm text-muted-foreground">
                {meeting.properties.hs_timezone}
              </p>
            </div>
          </div>

          {meeting.properties.hs_meeting_location && (
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 mt-0.5 text-muted-foreground" />
              <div>
                <p className="font-medium">Location</p>
                <p className="text-sm text-muted-foreground">
                  {meeting.properties.hs_meeting_location}
                </p>
                <p className="text-sm text-muted-foreground">
                  {meeting.properties.hs_meeting_location_type}
                </p>
              </div>
            </div>
          )}

          {meeting.properties.hs_meeting_external_url && (
            <div className="flex items-start gap-3">
              <ExternalLink className="h-5 w-5 mt-0.5 text-muted-foreground" />
              <div>
                <p className="font-medium">Meeting Link</p>
                <a
                  href={meeting.properties.hs_meeting_external_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline"
                >
                  {meeting.properties.hs_meeting_external_url}
                </a>
              </div>
            </div>
          )}

          {meeting.properties.hs_video_conference_url && (
            <div className="flex items-start gap-3">
              <ExternalLink className="h-5 w-5 mt-0.5 text-muted-foreground" />
              <div>
                <p className="font-medium">Meeting Link</p>
                <a
                  href={meeting.properties.hs_video_conference_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline"
                >
                  {meeting.properties.hs_video_conference_url}
                </a>
              </div>
            </div>
          )}

          {meeting.properties.hs_meeting_body && (
            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 mt-0.5 text-muted-foreground" />
              <div>
                <p className="font-medium">Description</p>
                <div
                  className="text-sm text-muted-foreground"
                  dangerouslySetInnerHTML={{
                    __html: meeting.properties.hs_meeting_body,
                  }}
                />
              </div>
            </div>
          )}

          {meeting.properties.hs_internal_meeting_notes && (
            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 mt-0.5 text-muted-foreground" />
              <div>
                <p className="font-medium">Internal Notes</p>
                <p className="text-sm text-muted-foreground whitespace-pre-line">
                  {meeting.properties.hs_internal_meeting_notes}
                </p>
              </div>
            </div>
          )}

          {meeting.properties.hs_guest_emails && (
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 mt-0.5 text-muted-foreground" />
              <div>
                <p className="font-medium">Guests</p>
                <p className="text-sm text-muted-foreground">
                  {meeting.properties.hs_guest_emails}
                </p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:justify-between">
          <div>
            {showDeleteConfirmation ? (
              <div className="flex items-center gap-2">
                <span className="text-sm">Sure?</span>
                <Button variant="destructive" size="sm" onClick={handleDelete}>
                  Yes
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDeleteConfirmation(false)}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <Button
                variant="destructive"
                onClick={() => setShowDeleteConfirmation(true)}
              >
                Delete
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button>Edit Meeting</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
