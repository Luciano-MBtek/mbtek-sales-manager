import { Engagement } from "./utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getContactName, getEngagementSource } from "./utils";
import Tiptap from "../Email/Tiptap";
import { formatDistanceToNow } from "date-fns";
import { getEngagementIcon } from "./ActivitiesTable";
import { Badge } from "../ui/badge";
import { getStatusBadgeVariant, getEngagementStatus } from "./utils";
import { Clock } from "lucide-react";

interface ActivityModalBodyProps {
  activityDetailOpen: boolean;
  setActivityDetailOpen: (open: boolean) => void;
  selectedActivity: Engagement | null;
}

const ActivityModalBody = ({
  activityDetailOpen,
  setActivityDetailOpen,
  selectedActivity,
}: ActivityModalBodyProps) => {
  if (!selectedActivity) return null;

  const activityContent = selectedActivity.properties.hs_body_preview || "";

  return (
    <Dialog open={activityDetailOpen} onOpenChange={setActivityDetailOpen}>
      <DialogContent className="max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between mr-6">
            <DialogTitle className="text-lg">
              {selectedActivity.properties.hs_engagement_type}
            </DialogTitle>
            <Badge
              variant={getStatusBadgeVariant(
                getEngagementStatus(selectedActivity)
              )}
            >
              {getEngagementStatus(selectedActivity)}
            </Badge>
          </div>
          <div className="flex items-center justify-between mt-1">
            <p className="text-sm text-muted-foreground">
              {selectedActivity ? getContactName(selectedActivity) : ""}
            </p>
            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>
                {formatDistanceToNow(
                  new Date(selectedActivity.properties.hs_timestamp),
                  {
                    addSuffix: true,
                  }
                )}
              </span>
            </div>
          </div>
        </DialogHeader>
        <div className="mt-4 text-sm space-y-4">
          <div className="flex items-center gap-2 mb-4">
            {getEngagementIcon(selectedActivity.properties.hs_engagement_type)}
            <span className="font-medium">
              {getEngagementSource(selectedActivity)}
            </span>
          </div>
          <div>
            <h3 className="font-medium mb-1">Message:</h3>
            <Tiptap
              content={activityContent}
              onChange={() => {}}
              readOnly={true}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ActivityModalBody;
