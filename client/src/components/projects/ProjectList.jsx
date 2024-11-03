import { useConfig } from "@/lib/utils";
import { organizationSelector } from "@/redux/reducers/organization/organizationReducer";
import {
  deleteProject,
  getProjects,
  updateProject,
  projectSelector,
} from "@/redux/reducers/project/projectReducer";
import { Loader, Trash2, Edit, Save, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { useOrganization } from "@clerk/clerk-react";
import { Button } from "../ui/button";
import { toast } from "sonner";

const ProjectList = () => {
  const { membership } = useOrganization();
  const dispatch = useDispatch();
  const { configWithJWT } = useConfig();
  const { projects, fetchingProjectsLoading, deletingProjectLoading } =
    useSelector(projectSelector);
  const { singleOrganization } = useSelector(organizationSelector);
  const [editMode, setEditMode] = useState({});
  const [tempProjectData, setTempProjectData] = useState({});

  useEffect(() => {
    if (configWithJWT.headers.Authorization) {
      dispatch(getProjects({ configWithJWT }));
    }
  }, [configWithJWT]);

  const handleDelete = ({ projectId, index }) => {
    dispatch(
      deleteProject({
        configWithJWT,
        organizationId: singleOrganization._id,
        projectId,
        index,
      })
    );
  };

  const toggleEditMode = (projectId, project) => {
    setEditMode((prev) => ({
      ...prev,
      [projectId]: !prev[projectId],
    }));
    setTempProjectData(project);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTempProjectData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (projectId) => {
    dispatch(
      updateProject({
        configWithJWT,
        organizationId: singleOrganization._id,
        projectId,
        projectData: {
          name: tempProjectData.name,
          description: tempProjectData.description,
        },
      })
    );

    setEditMode((prev) => ({ ...prev, [projectId]: false }));
  };

  const handleCancel = (projectId) => {
    setEditMode((prev) => ({ ...prev, [projectId]: false }));
  };

  if (fetchingProjectsLoading) return <Loader />;

  if (projects[singleOrganization._id]?.length === 0) {
    return (
      <p>
        No projects found.{" "}
        <Link
          className="underline underline-offset-2 text-blue-200 mr-3"
          to="/project/create"
        >
          Create New.
        </Link>
      </p>
    );
  }

  const isAdmin = membership?.role === "org:admin";
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {projects[singleOrganization._id]?.map((project, index) => (
        <Card key={project._id}>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              {editMode[project._id] ? (
                <Input
                  name="name"
                  value={tempProjectData.name}
                  onChange={handleChange}
                  className="bg-slate-950"
                  placeholder="Project Name"
                />
              ) : (
                <span>{project.name}</span>
              )}
              {isAdmin && (
                <div className="flex items-center space-x-2 ml-3">
                  {editMode[project._id] ? (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSave(project._id)}
                        disabled={deletingProjectLoading}
                      >
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCancel(project._id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleEditMode(project._id, project)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleDelete({ projectId: project._id, index })
                        }
                        disabled={deletingProjectLoading}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {editMode[project._id] ? (
              <Textarea
                name="description"
                value={tempProjectData.description}
                onChange={handleChange}
                className="bg-slate-950 h-28 resize-none"
                placeholder="Project Description"
              />
            ) : (
              <p className="text-sm text-gray-500 mb-4">
                {project.description || "No description given for the project"}
              </p>
            )}
            <Link
              to={`/organization/project/${project._id}`}
              className="text-blue-500 hover:underline transition-all duration-300"
            >
              View Project
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ProjectList;
