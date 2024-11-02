const express = require("express");
const { authorizeUser } = require("../middleware/authorizeUser");
const router = express.Router();

router.use("/auth", require("./auth/signUpRoute"));
router.use("/user/organization", require("./organization/organizationRoute"));
router.use(
  "/user/project",
  authorizeUser,
  require("../routes/project/projectRoutes")
);
module.exports = router;
