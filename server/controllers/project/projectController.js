const Organization = require("../../models/organizationSchema");
const Project = require("../../models/projectSchema");
const { getAuth } = require("@clerk/express");
const { sendResponse } = require("../../utils/sendResponse");
const Sprint = require("../../models/sprintSchema");
// CREATE a new project
const createProject = async (req, res) => {
  try {
    const { orgId } = getAuth(req);
    const { name, key, description, sprints, issues } = req.body;

    if (!orgId) {
      return sendResponse(res, 400, false, "Please select the organization ");
    }
    const organization = await Organization.findOne({
      clerkOrganizationId: orgId,
    });
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
      key: key.toUpperCase(),
      description,
      organizationId: organization._id,
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
    const { orgId } = getAuth(req);
    if (!orgId) {
      return sendResponse(
        res,
        404,
        false,
        "Select the orgainzation to get the projects"
      );
    }
    const organization = await Organization.findOne({
      clerkOrganizationId: orgId,
    });
    if (!organization) {
      return sendResponse(res, 404, false, "Organization not found");
    }

    const projects = await Project.find({
      organizationId: organization._id,
    }).populate("sprints");
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
    const project = await Project.findById(req.params.projectId).populate(
      "sprints"
    );
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
    // remove all the sprints for the fiven project id
    await Sprint.deleteMany({ projectId: req.params.projectId });

    // TODO : remove all the issues
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
