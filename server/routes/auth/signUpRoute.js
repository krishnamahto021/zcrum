const express = require("express");
const { createUser } = require("../../controllers/auth/authController");
const router = express.Router();

router.post("/sign-up", createUser);
module.exports = router;
