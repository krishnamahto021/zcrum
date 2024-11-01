const express = require("express");
const router = express.Router();
const {
  handleOrganizationWebhook,
  sendSingleOrganizationDetails,
} = require("../../controllers/organization/organizationController");
const { requireAuth } = require("@clerk/express");

router.post("/webhook", handleOrganizationWebhook);
router.get(
  "/:slug",
  requireAuth({ signInUrl: "/test" }),
  sendSingleOrganizationDetails
);

module.exports = router;
