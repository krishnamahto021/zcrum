const express = require("express");
const router = express.Router();

router.use("/auth", require("./auth/signUpRoute"));
router.use("/user/organization", require("./organization/organizationRoute"));
module.exports = router;
