import {
  setCurrentSprint,
  sprintSelector,
  updateSprint,
} from "@/redux/reducers/project/sprintReducer";
import { format, formatDistanceToNow, isAfter, isBefore } from "date-fns";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useConfig } from "@/lib/utils";

const SprintManager = ({ projectId }) => {
  const dispatch = useDispatch();
  const { currentSprint, sprints } = useSelector(sprintSelector);

  // Ensure currentSprint is defined before accessing its properties
  const [status, setStatus] = useState(currentSprint?.status || "");
  const startDate = new Date(currentSprint?.startDate || Date.now());
  const endDate = new Date(currentSprint?.endDate || Date.now());
  const now = new Date();
  const { configWithJWT } = useConfig();

  const canStart =
    isBefore(now, endDate) && isAfter(now, startDate) && status === "PLANNED";
  const canEnd = status === "ACTIVE";

  useEffect(() => {
    // Update the status whenever currentSprint changes
    setStatus(currentSprint?.status || "");
  }, [currentSprint]);

  const getStatusText = () => {
    if (status === "COMPLETED") {
      return `Sprint Ended`;
    }
    if (status === "ACTIVE" && isAfter(now, endDate)) {
      return `Overdue by ${formatDistanceToNow(endDate)}`;
    }
    if (status === "PLANNED" && isBefore(now, startDate)) {
      return `Starts in ${formatDistanceToNow(startDate)}`;
    }
    return null;
  };

  const handleSprintChange = (value) => {
    const selectedSprint = sprints[projectId]?.find((s) => s._id === value);
    if (selectedSprint) {
      dispatch(setCurrentSprint(selectedSprint));
      setStatus(selectedSprint.status);
    }
  };

  const handleUpdateOfSprint = ({ status }) => {
    dispatch(
      updateSprint({
        configWithJWT,
        sprintId: currentSprint._id,
        status,
        projectId,
      })
    );
  };

  return (
    <>
      <div className="flex justify-between items-center gap-4">
        <Select value={currentSprint?._id} onValueChange={handleSprintChange}>
          <SelectTrigger className="bg-slate-950 self-start">
            <SelectValue placeholder="Select Sprint" />
          </SelectTrigger>
          <SelectContent>
            {sprints[projectId]?.map((sprint) => (
              <SelectItem key={sprint._id} value={sprint._id}>
                {sprint.name} (
                {format(new Date(sprint.startDate), "MMM d, yyyy")} to{" "}
                {format(new Date(sprint.endDate), "MMM d, yyyy")})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {canStart && (
          <Button
            className="bg-green-900 text-white hover:text-black  duration-300"
            onClick={() => handleUpdateOfSprint({ status: "ACTIVE" })}
          >
            Start Sprint
          </Button>
        )}
        {canEnd && (
          <Button
            variant="destructive"
            onClick={() => handleUpdateOfSprint({ status: "COMPLETED" })}
          >
            End Sprint
          </Button>
        )}
      </div>
      {getStatusText() && (
        <Badge className="mt-3 ml-1 self-start">{getStatusText()}</Badge>
      )}
    </>
  );
};

export default SprintManager;
