import { Task } from "@/types/Tasks";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getContactName } from "./utils";
import Tiptap from "../Email/Tiptap";

interface TaskModalBodyProps {
  taskDetailOpen: boolean;
  setTaskDetailOpen: (open: boolean) => void;
  selectedTask: Task | null;
}

const TaskModalBody = ({
  taskDetailOpen,
  setTaskDetailOpen,
  selectedTask,
}: TaskModalBodyProps) => {
  return (
    <Dialog open={taskDetailOpen} onOpenChange={setTaskDetailOpen}>
      <DialogContent className="max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{selectedTask?.properties.hs_task_subject}</DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">
            {selectedTask ? getContactName(selectedTask) : ""}
          </p>
        </DialogHeader>
        <div className="mt-4 text-sm space-y-4">
          <div>
            <h3 className="font-medium mb-1">Description:</h3>

            <Tiptap
              content={selectedTask?.properties.hs_task_body || ""}
              onChange={() => {}}
              readOnly={true}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskModalBody;
