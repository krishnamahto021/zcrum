import React, { useState } from "react";
import CreateIssueDrawer from "./CreateIssueDrawer";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";

const SprintBoard = ({ projectId }) => {
 
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  return (
    <>
      <Button
        variant="ghost"
        className="w-full"
        onClick={() => setIsDrawerOpen(true)}
      >
        <Plus className="mr-2 h-4 w-4" />
        Create Issue
      </Button>
      <CreateIssueDrawer
      projectId={projectId}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </>
  );
};

export default SprintBoard;
