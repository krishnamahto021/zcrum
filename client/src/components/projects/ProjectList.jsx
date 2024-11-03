import { useConfig } from "@/lib/utils";
import { organizationSelector } from "@/redux/reducers/organization/organizationReducer";
import {
  deleteProject,
  getProjects,
  projectSelector,
} from "@/redux/reducers/project/projectReducer";
import { Loader, Trash2 } from "lucide-react";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useOrganization } from "@clerk/clerk-react";
import { Button } from "../ui/button";

const ProjectList = () => {
  const { membership } = useOrganization();
  const dispatch = useDispatch();
  const { configWithJWT } = useConfig();
  const { projects, fetchingProjectsLoading, deletingProjectLoading } =
    useSelector(projectSelector);
  const { singleOrganization } = useSelector(organizationSelector);
  console.log(projects);

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
              {project.name}
              {isAdmin && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`${
                      deletingProjectLoading ? "animate-pulse" : ""
                    }`}
                    onClick={() =>
                      handleDelete({ projectId: project._id, index })
                    }
                    disabled={deletingProjectLoading}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-4">
              {project.description || "No description given for the project"}
            </p>
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
