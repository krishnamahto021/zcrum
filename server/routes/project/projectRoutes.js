const express = require("express");
const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
} = require("../../controllers/project/projectController");
const router = express.Router();

router.post("/create", createProject);
router.get("/", getProjects);
router.get("/get/:projectId", getProjectById);
router.put("/:projectId", updateProject);
router.delete("/:projectId", deleteProject);
module.exports = router;
