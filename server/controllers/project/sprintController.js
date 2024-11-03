const Project = require("../../models/projectSchema");
const Sprint = require("../../models/sprintSchema");
const { sendResponse } = require("../../utils/sendResponse");

// Create a new Sprint
module.exports.createSprint = async (req, res) => {
  try {
    const { startDate, endDate, status, projectId } = req.body;

    if (!startDate || !endDate || !projectId) {
      return sendResponse(
        res,
        400,
        false,
        "All required fields must be provided."
      );
    }
    if (new Date(startDate) >= new Date(endDate)) {
      return sendResponse(
        res,
        400,
        false,
        "Start date must be before end date."
      );
    }

    // Check if project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return sendResponse(res, 404, false, "Project not found.");
    }
    const sprintsCount = project.sprints.length;
    const sprintKey = `${project.key}-${sprintsCount + 1}`;

    // Create new Sprint
    const sprint = await Sprint.create({
      name: sprintKey,
      startDate,
      endDate,
      status,
      projectId,
    });
    project.sprints.push(sprint._id);
    await project.save();
    sendResponse(res, 201, true, "Sprint created successfully", { sprint });
  } catch (error) {
    console.error(error);
    sendResponse(res, 500, false, "Server error", { error: error.message });
  }
};

// Get a Sprint by ID
module.exports.getSprint = async (req, res) => {
  try {
    const { sprintId } = req.params;
    const sprint = await Sprint.findById(sprintId).populate("projectId");
    //   .populate("issues");

    if (!sprint) {
      return sendResponse(res, 404, false, "Sprint not found.");
    }

    sendResponse(res, 200, true, "Sprint retrieved successfully", { sprint });
  } catch (error) {
    console.error(error);
    sendResponse(res, 500, false, "Server error", { error: error.message });
  }
};

// Update a Sprint
module.exports.updateSprint = async (req, res) => {
  try {
    const { sprintId } = req.params;
    const { startDate, endDate } = req.body;

    if (!sprintId) {
      return sendResponse(res, 404, false, "Sprint not found.");
    }

    // Validate dates if provided
    if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
      return sendResponse(
        res,
        400,
        false,
        "Start date must be before end date."
      );
    }

    const sprint = await Sprint.findByIdAndUpdate(sprintId, req.body, {
      new: true,
      runValidators: true,
    }).populate("projectId");
    //   .populate("issues");

    await sprint.save();
    sendResponse(res, 200, true, "Sprint updated successfully", { sprint });
  } catch (error) {
    console.error(error);
    sendResponse(res, 500, false, "Server error", { error: error.message });
  }
};

// Delete a Sprint
module.exports.deleteSprint = async (req, res) => {
  try {
    const { sprintId } = req.params;

    const sprint = await Sprint.findById(sprintId);
    if (!sprint) {
      return sendResponse(res, 404, false, "Sprint not found.");
    }

    // Find the project associated with the sprint
    const project = await Project.findById(sprint.projectId);
    if (!project) {
      return sendResponse(res, 404, false, "Project not found.");
    }

    // Remove the sprint ID from the project's sprints array
    project.sprints = project.sprints.filter(
      (id) => id.toString() !== sprintId
    );
    await project.save(); // Save the updated project
    await sprint.deleteOne();
    sendResponse(res, 200, true, "Sprint deleted successfully");
  } catch (error) {
    console.error(error);
    sendResponse(res, 500, false, "Server error", { error: error.message });
  }
};

// get all sprints of a project
module.exports.getAllSprintsForProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    if (!projectId) {
      return sendResponse(res, 404, false, "Project not found.");
    }
    const sprint = await Sprint.find({ projectId }).populate("projectId");
    //   .populate("issues");

    if (!sprint) {
      return sendResponse(res, 404, false, "Sprint not found.");
    }

    sendResponse(res, 200, true, "Sprint retrieved successfully", { sprint });
  } catch (error) {
    console.error(error);
    sendResponse(res, 500, false, "Server error", { error: error.message });
  }
};