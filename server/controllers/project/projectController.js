const Organization = require("../../models/organizationSchema");
const Project = require("../../models/projectSchema");
const User = require("../../models/userSchema");
const { sendResponse } = require("../../utils/sendResponse");
// CREATE a new project
const createProject = async (req, res) => {
  try {
    const { name, key, description, organizationId, sprints, issues } =
      req.body;
    const organization = await Organization.findById(organizationId);

    if (!organization) {
      return sendResponse(res, 404, false, "Organization not found");
    }

    if (organization.createdBy.toString() !== req.user.toString()) {
      return sendResponse(
        res,
        400,
        false,
        "You are not authorized to create project"
      );
    }
    const project = await Project.create({
      name,
      key,
      description,
      organizationId,
      sprints,
      issues,
    });
    sendResponse(res, 201, true, "Project created successfully", { project });
  } catch (error) {
    sendResponse(res, 400, false, "Error creating project", {
      error: error.message,
    });
  }
};

// READ all projects for the given organinzation
const getProjects = async (req, res) => {
  try {
    const { organizationId } = req.params;
    const projects = await Project.find({ organizationId });
    sendResponse(res, 200, true, "Projects retrieved successfully", {
      projects,
    });
  } catch (error) {
    sendResponse(res, 400, false, "Error retrieving projects", {
      error: error.message,
    });
  }
};

// READ a single project by ID
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) return sendResponse(res, 404, false, "Project not found");
    sendResponse(res, 200, true, "Project retrieved successfully", { project });
  } catch (error) {
    sendResponse(res, 400, false, "Error retrieving project", {
      error: error.message,
    });
  }
};

// UPDATE a project by ID
const updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.projectId,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).populate("organizationId", "createdBy");

    if (!project) return sendResponse(res, 404, false, "Project not found");
    if (project.organizationId.createdBy.toString() !== req.user.toString()) {
      return sendResponse(
        res,
        404,
        false,
        "You are not authorized to update the project"
      );
    }
    sendResponse(res, 200, true, "Project updated successfully", { project });
  } catch (error) {
    sendResponse(res, 400, false, "Error updating project", {
      error: error.message,
    });
  }
};

// DELETE a project by ID
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId).populate(
      "organizationId",
      "createdBy"
    );
    if (!project) return sendResponse(res, 404, false, "Project not found");
    if (project.organizationId.createdBy.toString() !== req.user.toString()) {
      return sendResponse(res, 404, false, "You are not authorized to delete");
    }
    await project.deleteOne();
    sendResponse(res, 200, true, "Project deleted successfully");
  } catch (error) {
    sendResponse(res, 400, false, "Error deleting project", {
      error: error.message,
    });
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
};
