const express = require("express");
const {
  userHookToLinkWithClerk,
} = require("../../controllers/auth/authController");
const router = express.Router();

router.post("/sign-up", userHookToLinkWithClerk);
module.exports = router;
