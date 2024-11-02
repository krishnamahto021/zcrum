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
  const {
    id,
    name,
    slug,
    members = [],
    metadata,
    created_by,
    image_url,
  } = evt.data;

  try {
    const createdBy = await User.find({ clerkId: created_by });

    let responseMessage;
    let organization;

    switch (type) {
      case "organization.created":
        organization = await Organization.create({
          clerkOrganizationId: id,
          name,
          createdBy: createdBy._id,
          slug,
          members,
          metadata,
          imageUrl: image_url,
        });
        responseMessage = "Organization created successfully";
        break;

      case "organization.updated":
        organization = await Organization.findOneAndUpdate(
          { clerkOrganizationId: id },
          {
            name,
            slug,
            members,
            metadata,
            imageUrl: image_url,
          },
          { new: true }
        );
        if (!organization) {
          return sendResponse(
            res,
            404,
            false,
            "Organization not found for update"
          );
        }
        responseMessage = "Organization updated successfully";
        break;

      case "organization.deleted":
        organization = await Organization.findOneAndDelete({
          clerkOrganizationId: id,
        });
        if (!organization) {
          return sendResponse(
            res,
            404,
            false,
            "Organization not found for deletion"
          );
        }
        responseMessage = "Organization deleted successfully";
        break;

      default:
        return sendResponse(res, 400, false, "Unhandled event type");
    }

    return sendResponse(res, 200, true, responseMessage, {
      organization,
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

// todo : webhook to handle the members


module.exports = { handleOrganizationWebhook, sendSingleOrganizationDetails };
