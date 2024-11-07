import React, { useEffect, useState } from "react";
import CreateIssueDrawer from "./CreateIssueDrawer";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { useDispatch, useSelector } from "react-redux";
import {
  getIssues,
  issueSelector,
} from "@/redux/reducers/project/issueReducer";
import { sprintSelector } from "@/redux/reducers/project/sprintReducer";
import { useConfig } from "@/lib/utils";
import IssueCard from "./IssueCard";

const SprintBoard = ({ projectId }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { issues } = useSelector(issueSelector);
  const { currentSprint } = useSelector(sprintSelector);
  const statuses = [
    {
      name: "Todo",
      key: "TODO",
    },
    {
      name: "In Progress",
      key: "IN_PROGRESS",
    },
    {
      name: "In Review",
      key: "IN_REVIEW",
    },
    {
      name: "Done",
      key: "DONE",
    },
  ];
  const { configWithJWT } = useConfig();
  const dispatch = useDispatch();

  useEffect(() => {
    if (configWithJWT.headers.Authorization) {
      if (currentSprint) {
        dispatch(getIssues({ configWithJWT, sprintId: currentSprint._id }));
      }
    }
  }, [configWithJWT, currentSprint]);
  return (
    <>
      <DragDropContext>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 bg-slate-900 p-4 rounded-lg">
          {statuses.map((column) => (
            <Droppable key={column.key} droppableId={column.key}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-2"
                >
                  <h3 className="font-semibold mb-2 text-center">
                    {column.name}
                  </h3>
                  {issues
                    ?.filter((issue) => issue.status === column.key)
                    .map((issue, index) => (
                      <Draggable
                        key={issue._id}
                        draggableId={issue._id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <IssueCard issue={issue} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                  {column.key === "TODO" &&
                    currentSprint.status !== "COMPLETED" && (
                      <Button
                        variant="ghost"
                        className="w-full"
                        onClick={() => setIsDrawerOpen(true)}
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
    </>
  );
};

export default SprintBoard;
