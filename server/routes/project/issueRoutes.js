const express = require("express");
const {
  createIssue,
  getIssues,
  getIssueById,
  deleteIssue,
} = require("../../controllers/project/issueController");
const router = express.Router();

router.post("/create", createIssue);
router.get("/sprint/:sprintId", getIssues);
router.get("/:id", getIssueById);
router.delete("/:id", deleteIssue);

module.exports = router;
