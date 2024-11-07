import React, { useEffect } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "../ui/drawer";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { issueSchema } from "@/lib/formSchema/issueSchema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import MDEditor from "@uiw/react-md-editor";
import { useAuth } from "@clerk/clerk-react";
import { useDispatch, useSelector } from "react-redux";
import {
  getOrganization,
  organizationSelector,
} from "@/redux/reducers/organization/organizationReducer";
import { useConfig } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { sprintSelector } from "@/redux/reducers/project/sprintReducer";
import { createIssue } from "@/redux/reducers/project/issueReducer";

const CreateIssueDrawer = ({ isOpen, onClose, projectId }) => {
  const { orgSlug } = useAuth();
  const { singleOrganization } = useSelector(organizationSelector);
  const { currentSprint } = useSelector(sprintSelector);
  const { configWithJWT } = useConfig();
  const dispatch = useDispatch();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(issueSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "MEDIUM",
      status: "TODO",
      assigneeId: "",
      projectId: projectId || "",
      sprintId: currentSprint._id || "",
    },
  });

  useEffect(() => {
    if (
      isOpen &&
      configWithJWT.headers.Authorization &&
      (!singleOrganization || !singleOrganization.members)
    ) {
      dispatch(getOrganization({ configWithJWT, organizationSlug: orgSlug }));
    }
  }, [isOpen, configWithJWT, singleOrganization, orgSlug]);

  const onSubmit = (data) => {
    // Prepare the data according to the backend API structure
    const issueData = {
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      assigneeId: data.assigneeId,
      projectId: projectId,
      sprintId: currentSprint._id,
    };
    dispatch(createIssue({ configWithJWT, issueData }));

    // Reset form and close drawer
    reset();
    onClose();
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`;
  };

  const UserDisplay = ({ member }) => (
    <div className="flex items-center gap-2 w-full">
      <Avatar className="h-6 w-6 flex-shrink-0">
        <AvatarImage
          src={member.userId.profileImage}
          alt={`${member.userId.firstName} ${member.userId.lastName}`}
        />
        <AvatarFallback>
          {getInitials(member.userId.firstName, member.userId.lastName)}
        </AvatarFallback>
      </Avatar>
      <span className="truncate">
        {member.userId.firstName} {member.userId.lastName}
      </span>
    </div>
  );

  return (
    <Drawer open={isOpen} onClose={onClose}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Create a New Issue</DrawerTitle>
        </DrawerHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Title
            </label>
            <Input id="title" {...register("title")} />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="assigneeId"
              className="block text-sm font-medium mb-1"
            >
              Assignee
            </label>
            <Controller
              name="assigneeId"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select assignee">
                      {field.value && singleOrganization?.members && (
                        <>
                          {singleOrganization.members.map((member) =>
                            member.userId._id === field.value ? (
                              <UserDisplay
                                key={member.userId._id}
                                member={member}
                              />
                            ) : null
                          )}
                        </>
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {singleOrganization?.members?.map((member) => (
                      <SelectItem
                        key={member.userId._id}
                        value={member.userId._id}
                        className="w-full"
                      >
                        <UserDisplay member={member} />
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.assigneeId && (
              <p className="text-red-500 text-sm mt-1">
                {errors.assigneeId.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium mb-1">
              Status
            </label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TODO">To Do</SelectItem>
                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                    <SelectItem value="DONE">Done</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium mb-1"
            >
              Description
            </label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <MDEditor
                  value={field.value}
                  onChange={field.onChange}
                  data-color-mode="dark"
                />
              )}
            />
          </div>

          <div>
            <label
              htmlFor="priority"
              className="block text-sm font-medium mb-1"
            >
              Priority
            </label>
            <Controller
              name="priority"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">Low</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                    <SelectItem value="URGENT">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <Button type="submit" className="block m-auto">
            Create Issue
          </Button>
        </form>
      </DrawerContent>
    </Drawer>
  );
};

export default CreateIssueDrawer;
