const Issue = require("../../models/issueSchema");
const { sendResponse } = require("../../utils/sendResponse");
const Project = require("../../models/projectSchema");

// helper function to get next order Number
const getNextOrderNumber = async (projectId, status) => {
  const lastIssue = await Issue.findOne(
    { projectId, status },
    { order: 1 },
    { sort: { order: -1 } }
  );

  return lastIssue ? lastIssue.order + 1 : 1;
};

// Create Issue
module.exports.createIssue = async (req, res) => {
  try {
    const {
      title,
      description,
      status,
      priority,
      assigneeId,
      projectId,
      sprintId,
    } = req.body;

    // Validation
    if (!title || !priority || !projectId) {
      return sendResponse(res, 400, false, "Missing required fields");
    }
    const project = await Project.findById(projectId);
    if (!project) {
      return sendResponse(res, 400, false, "Project doesnot exist");
    }
    const order = await getNextOrderNumber(projectId, status);

    // Create new issue document
    const newIssue = await Issue.create({
      title,
      description,
      status,
      priority,
      assigneeId,
      reporterId: req.user,
      projectId,
      sprintId,
      order,
    });
    project.issues.push(newIssue._id);
    await project.save();
    await newIssue.populate([
      { path: "assigneeId" }, // Adjust fields to select as needed
      { path: "projectId" }, // Adjust fields to select as needed
      { path: "sprintId" }, // Adjust fields to select as needed
    ]);
    return sendResponse(res, 201, true, "Issue created successfully", {
      issue: newIssue,
    });
  } catch (error) {
    console.error(`Error in creating issue ${error}`);

    return sendResponse(res, 500, false, "Failed to create issue", {
      error: error.message,
    });
  }
};

// Get All Issues for a Project or Sprint
exports.getIssues = async (req, res) => {
  const { sprintId } = req.params;

  try {
    const issues = await Issue.find({ sprintId }).populate(
      "assigneeId reporterId projectId sprintId"
    );

    return sendResponse(res, 200, true, "Issues fetched successfully", {
      issues,
    });
  } catch (error) {
    return sendResponse(res, 500, false, "Failed to fetch issues", {
      error: error.message,
    });
  }
};

// Get Single Issue by ID
exports.getIssueById = async (req, res) => {
  const { id } = req.params;

  try {
    const issue = await Issue.findById(id).populate(
      "assigneeId reporterId projectId sprintId"
    );

    if (!issue) {
      return sendResponse(res, 404, false, "Issue not found");
    }

    return sendResponse(res, 200, true, "Issue fetched successfully", {
      issue,
    });
  } catch (error) {
    return sendResponse(res, 500, false, "Failed to fetch issue", {
      error: error.message,
    });
  }
};

// update issue
exports.updateIssue = async (req, res) => {
  const { id } = req.params;
  const updateFields = req.body;

  try {
    // Validate if issue exists
    const existingIssue = await Issue.findById(id);
    if (!existingIssue) {
      return sendResponse(res, 404, false, "Issue not found");
    }

    // If status is being updated, handle order updates
    if (updateFields.status && updateFields.status !== existingIssue.status) {
      const newOrder = await getNextOrderNumber(
        existingIssue.projectId,
        updateFields.status
      );
      updateFields.order = newOrder;
    }

    // If projectId is being updated, update project references
    if (
      updateFields.projectId &&
      updateFields.projectId !== existingIssue.projectId.toString()
    ) {
      // Remove issue from old project
      await Project.findByIdAndUpdate(existingIssue.projectId, {
        $pull: { issues: existingIssue._id },
      });

      // Add issue to new project
      await Project.findByIdAndUpdate(updateFields.projectId, {
        $push: { issues: existingIssue._id },
      });

      // Get new order number for the new project
      const newOrder = await getNextOrderNumber(
        updateFields.projectId,
        updateFields.status || existingIssue.status
      );
      updateFields.order = newOrder;
    }

    // Update the issue
    const updatedIssue = await Issue.findByIdAndUpdate(
      id,
      { $set: updateFields },
      {
        new: true,
        runValidators: true,
      }
    ).populate("assigneeId reporterId projectId sprintId");

    if (!updatedIssue) {
      return sendResponse(res, 404, false, "Issue not found");
    }

    return sendResponse(res, 200, true, "Issue updated successfully", {
      issue: updatedIssue,
    });
  } catch (error) {
    console.error(`Error in updating issue: ${error}`);
    return sendResponse(res, 500, false, "Failed to update issue", {
      error: error.message,
    });
  }
};

// Delete Issue
exports.deleteIssue = async (req, res) => {
  const { id } = req.params;

  try {
    const issue = await Issue.findByIdAndDelete(id);

    if (!issue) {
      return sendResponse(res, 404, false, "Issue not found");
    }

    return sendResponse(res, 200, true, "Issue deleted successfully", {
      issue,
    });
  } catch (error) {
    return sendResponse(res, 500, false, "Failed to delete issue", {
      error: error.message,
    });
  }
};
