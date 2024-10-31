const express = require("express");
const router = express.Router();

router.use("/auth", require("./auth/signUpRoute"));
module.exports = router;
