import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { ExternalLink } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import MDEditor from "@uiw/react-md-editor";
import UserAvatar from "../user/UserAvatar";
import { useAuth } from "@clerk/clerk-react";
import { useDispatch } from "react-redux";
import {
  deleteIssue,
  updateIssue,
} from "@/redux/reducers/project/issueReducer";
import { useConfig } from "@/lib/utils";
import { toast } from "sonner";

const priorityOptions = ["LOW", "MEDIUM", "HIGH", "URGENT"];

const IssueDetailsDialog = ({ isOpen, onClose, issue, borderCol }) => {
  const { userId, orgRole } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isProjectPage = !location.pathname.startsWith("/organization/project/");

  const statuses = [
    { name: "Todo", key: "TODO" },
    { name: "In Progress", key: "IN_PROGRESS" },
    { name: "In Review", key: "IN_REVIEW" },
    { name: "Done", key: "DONE" },
  ];

  const [status, setStatus] = useState(issue.status);
  const [priority, setPriority] = useState(issue.priority);
  const [isUpdating, setIsUpdating] = useState(false);
  const dispatch = useDispatch();
  const { configWithJWT } = useConfig();
  const handleGoToProject = () => {
    navigate(`/organization/project/${issue.projectId}`);
  };

  const canChange =
    userId === issue.reporterId.clerkId || orgRole === "org:admin";

  const handleUpdate = async () => {
    try {
      const issueData = {
        status,
        priority,
      };
      setIsUpdating(true);
      dispatch(updateIssue({ configWithJWT, issueData, issueId: issue._id }));
      onClose();
    } catch (error) {
      toast.error("Failed to update issue:", error);
    } finally {
      setIsUpdating(false);
    }
  };
  const handleDelete = async () => {
    dispatch(deleteIssue({ configWithJWT, issueId: issue._id }));
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-3xl">{issue.title}</DialogTitle>
            {isProjectPage && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleGoToProject}
                title="Go to Project"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            )}
          </div>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Select
              value={status}
              onValueChange={setStatus}
              disabled={!canChange}
            >
              <SelectTrigger className="">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((option) => (
                  <SelectItem key={option.key} value={option.key}>
                    {option.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={priority}
              onValueChange={setPriority}
              disabled={!canChange}
            >
              <SelectTrigger className={`border ${borderCol} rounded`}>
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                {priorityOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <h4 className="font-semibold">Description</h4>
            <MDEditor.Markdown
              className="rounded px-2 py-1"
              source={issue.description ? issue.description : "--"}
            />
          </div>
          <div className="flex justify-between">
            <div className="flex flex-col gap-2">
              <h4 className="font-semibold">Assignee</h4>
              <UserAvatar user={issue.assigneeId} />
            </div>
            <div className="flex flex-col gap-2">
              <h4 className="font-semibold">Reporter</h4>
              <UserAvatar user={issue.reporterId} />
            </div>
          </div>
          <div className="flex justify-between gap-2">
            {canChange && (
              <>
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={handleDelete}
                >
                  Delete
                </Button>
                <Button
                  onClick={handleUpdate}
                  disabled={isUpdating || !canChange}
                  className="w-full"
                >
                  {isUpdating ? "Updating..." : "Update Issue"}
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default IssueDetailsDialog;
