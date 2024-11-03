const express = require("express");
const { authorizeUser } = require("../middleware/authorizeUser");
const router = express.Router();

router.use("/auth", require("./auth/signUpRoute"));
router.use("/user/organization", require("./organization/organizationRoute"));
router.use(
  "/organization/project",
  authorizeUser,
  require("../routes/project/projectRoutes")
);
router.use(
  "/organization/project/sprint",
  authorizeUser,
  require("../routes/project/sprintRoutes")
);
module.exports = router;
