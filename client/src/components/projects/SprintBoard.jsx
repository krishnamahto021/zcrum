import React, { useEffect, useState } from "react";
import CreateIssueDrawer from "./CreateIssueDrawer";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { useDispatch, useSelector } from "react-redux";
import {
  getIssues,
  issueSelector,
  updateIssue,
} from "@/redux/reducers/project/issueReducer";
import { sprintSelector } from "@/redux/reducers/project/sprintReducer";
import { useConfig } from "@/lib/utils";
import IssueCard from "./IssueCard";

const SprintBoard = ({ projectId }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { issuesByStatus, loading } = useSelector(issueSelector);
  const { currentSprint } = useSelector(sprintSelector);
  const dispatch = useDispatch();
  const { configWithJWT } = useConfig();

  const statuses = [
    { name: "Todo", key: "TODO" },
    { name: "In Progress", key: "IN_PROGRESS" },
    { name: "In Review", key: "IN_REVIEW" },
    { name: "Done", key: "DONE" },
  ];

  useEffect(() => {
    if (configWithJWT.headers.Authorization) {
      if (currentSprint._id) {
        dispatch(getIssues({ configWithJWT, sprintId: currentSprint._id }));
      }
    }
  }, [currentSprint, configWithJWT.headers.Authorization]);

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    // If dropped outside a droppable area
    if (!destination) return;

    // If dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const sourceStatus = source.droppableId;
    const destinationStatus = destination.droppableId;
    const issue = issuesByStatus[sourceStatus].find(
      (i) => i._id === draggableId
    );

    if (!issue) return;

    // Calculate new order
    let newOrder;
    if (destination.index === 0) {
      // If dropped at the start
      const firstIssue = issuesByStatus[destinationStatus][0];
      newOrder = firstIssue ? firstIssue.order / 2 : 1;
    } else if (destination.index >= issuesByStatus[destinationStatus].length) {
      // If dropped at the end
      const lastIssue =
        issuesByStatus[destinationStatus][
          issuesByStatus[destinationStatus].length - 1
        ];
      newOrder = lastIssue ? lastIssue.order + 1 : 1;
    } else {
      // If dropped between two issues
      const beforeIssue =
        issuesByStatus[destinationStatus][destination.index - 1];
      const afterIssue = issuesByStatus[destinationStatus][destination.index];
      newOrder = (beforeIssue.order + afterIssue.order) / 2;
    }

    // Dispatch update
    dispatch(
      updateIssue({
        configWithJWT,
        issueId: draggableId,
        issueData: {
          status: destinationStatus,
          order: newOrder,
          previousStatus: sourceStatus,
        },
      })
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 bg-slate-900 p-4 rounded-lg">
          {statuses.map((column) => (
            <Droppable key={column.key} droppableId={column.key}>
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={`space-y-2 p-3 rounded-lg transition-colors ${
                    snapshot.isDraggingOver ? "bg-slate-800/50" : ""
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">{column.name}</h3>
                    <span className="text-sm text-slate-400">
                      {issuesByStatus[column.key]?.length || 0}
                    </span>
                  </div>

                  <div className="space-y-2 min-h-[200px]">
                    {issuesByStatus[column.key]?.map((issue, index) => (
                      <Draggable
                        key={issue._id}
                        draggableId={issue._id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`transform transition-transform ${
                              snapshot.isDragging ? "scale-105" : ""
                            }`}
                          >
                            <IssueCard issue={issue} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>

                  {column.key === "TODO" &&
                    currentSprint?.status !== "COMPLETED" && (
                      <Button
                        className="w-full mt-2"
                        onClick={() => setIsDrawerOpen(true)}
                        variant="ghost"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Create Issue
                      </Button>
                    )}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      {isDrawerOpen && (
        <CreateIssueDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          projectId={projectId}
        />
      )}
    </>
  );
};

export default SprintBoard;
