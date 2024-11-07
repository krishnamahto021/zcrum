const Issue = require("../../models/issueSchema");
const { sendResponse } = require("../../utils/sendResponse");

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
    if (!title  || !priority || !projectId) {
      return sendResponse(res, 400, false, "Missing required fields");
    }

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
    });
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
  const { projectId, sprintId } = req.query;

  try {
    const query = { projectId };
    if (sprintId) query.sprintId = sprintId;

    const issues = await Issue.find(query)
      .sort({ status: 1})
      .populate("assigneeId reporterId projectId sprintId");
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

// Delete Issue
exports.deleteIssue = async (req, res) => {
  const { id } = req.params;

  try {
    const issue = await Issue.findByIdAndDelete(id);

    if (!issue) {
      return sendResponse(res, 404, false, "Issue not found");
    }

    return sendResponse(res, 200, true, "Issue deleted successfully");
  } catch (error) {
    return sendResponse(res, 500, false, "Failed to delete issue", {
      error: error.message,
    });
  }
};
