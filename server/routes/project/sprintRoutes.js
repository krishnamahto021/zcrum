const express = require("express");
const {
  createSprint,
  getSprint,
  updateSprint,
  deleteSprint,
  getAllSprintsForProject,
} = require("../../controllers/project/sprintController");
const router = express.Router();

router.post("/create", createSprint);
router.get("/:sprintId", getSprint);
router.put("/:sprintId", updateSprint);
router.delete("/:sprintId", deleteSprint);
router.get("/get-all/:projectId", getAllSprintsForProject);

module.exports = router;
