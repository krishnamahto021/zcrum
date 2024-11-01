const { Webhook } = require("svix");
const Organization = require("../../models/organizationSchema");
const User = require("../../models/userSchema");
const { sendResponse } = require("../../utils/sendResponse");

const handleOrganizationWebhook = async (req, res) => {
  const svix_id = req.headers["svix-id"];
  const svix_timestamp = req.headers["svix-timestamp"];
  const svix_signature = req.headers["svix-signature"];

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return sendResponse(res, 400, false, "Missing required Svix headers");
  }

  const payload = req.body;
  const body = JSON.stringify(payload);

  const wh = new Webhook(process.env.WERBHOOK_ORGANIZATION_SECRET);
  let evt;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return sendResponse(res, 400, false, "Webhook verification failed", {
      error: err.message,
    });
  }

  const { type } = evt;
  const { id, name, slug, members = [], metadata, created_by } = evt.data;

  try {
    // Gather Clerk IDs, including created_by and any members if present
    const clerkIds = new Set([created_by, ...members.map((m) => m.user_id)]);

    // Batch query all required users in one go
    const users = await User.find({
      clerkUserId: { $in: Array.from(clerkIds) },
    });
    console.log(users);

    const userMap = users.reduce((acc, user) => {
      acc[user.clerkUserId] = user._id;
      return acc;
    }, {});
    console.log(userMap, created_by);

    if (!userMap[created_by]) {
      return sendResponse(res, 404, false, "Creator user not found");
    }

    // Map member Clerk IDs to MongoDB ObjectIds, handling absence of members
    const memberData = members.length
      ? members.map((member) => ({
          userId: userMap[member.user_id] || null, // Set to null if not found
          role: member.role,
          joinedAt: member.joined_at,
        }))
      : []; // Set to empty array if no members are provided

    // Create organization
    const newOrganization = await Organization.create({
      clerkOrganizationId: id,
      name,
      createdBy: userMap[created_by],
      slug,
      members: memberData,
      metadata,
    });
    return sendResponse(res, 200, true, "Organization created successfully", {
      organization: newOrganization,
    });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return sendResponse(
      res,
      500,
      false,
      "Internal server error processing webhook",
      {
        error: error.message,
      }
    );
  }
};

const sendSingleOrganizationDetails = async (req, res) => {
  try {
    const { slug } = req.params;

    const organization = await Organization.findOne({ slug });
    if (!organization) {
      return sendResponse(res, 404, false, "Organization not found");
    }
    return sendResponse(res, 200, true, "Fetched organization", {
      organization,
    });
  } catch (error) {
    return sendResponse(res, 500, false, "Internal server error");
  }
};

module.exports = { handleOrganizationWebhook, sendSingleOrganizationDetails };
