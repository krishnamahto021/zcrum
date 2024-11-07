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

  try {
    let responseMessage;
    let organization;

    switch (type) {
      case "organization.created":
        const { id, name, slug, created_by, image_url } = evt.data;
        const createdBy = await User.findOne({ clerkId: created_by });

        if (!createdBy) {
          return sendResponse(res, 404, false, "Creator user not found");
        }

        organization = await Organization.create({
          clerkOrganizationId: id,
          name,
          slug,
          imageUrl: image_url,
          createdBy: createdBy._id,
          members: [
            {
              userId: createdBy._id,
              role: "admin",
              joinedAt: new Date(),
            },
          ],
        });

        // Populate the created organization
        organization = await organization.populate([
          {
            path: "members.userId",
            select: "firstName lastName email profileImage clerkId",
          },
          {
            path: "createdBy",
            select: "firstName lastName email profileImage",
          },
        ]);

        responseMessage = "Organization created successfully";
        break;

      case "organizationMembership.created":
        const memberClerkId = evt.data.public_user_data.user_id;
        const organizationId = evt.data.organization.id;
        const role = evt.data.role === "org:admin" ? "admin" : "member";

        const memberUser = await User.findOne({ clerkId: memberClerkId });
        if (!memberUser) {
          return sendResponse(res, 404, false, "Member user not found");
        }

        organization = await Organization.findOne({
          clerkOrganizationId: organizationId,
        });

        if (!organization) {
          return sendResponse(res, 404, false, "Organization not found");
        }

        // Check if user is already a member
        const existingMember = organization.members.find(
          (member) => member.userId.toString() === memberUser._id.toString()
        );

        if (!existingMember) {
          organization.members.push({
            userId: memberUser._id,
            role,
            joinedAt: new Date(),
          });
          await organization.save();

          // Populate the updated organization
          organization = await organization.populate([
            {
              path: "members.userId",
              select: "firstName lastName email profileImage clerkId",
            },
            {
              path: "createdBy",
              select: "firstName lastName email profileImage",
            },
          ]);
        }

        responseMessage = "Member added successfully";
        break;

      case "organizationMembership.deleted":
        const removedMemberClerkId = evt.data.public_user_data.user_id;
        const orgIdForRemoval = evt.data.organization.id;

        const removedUser = await User.findOne({
          clerkId: removedMemberClerkId,
        });
        if (!removedUser) {
          return sendResponse(res, 404, false, "Member user not found");
        }

        organization = await Organization.findOne({
          clerkOrganizationId: orgIdForRemoval,
        });

        if (!organization) {
          return sendResponse(res, 404, false, "Organization not found");
        }

        // Remove member
        organization.members = organization.members.filter(
          (member) => member.userId.toString() !== removedUser._id.toString()
        );
        await organization.save();

        // Populate after removing member
        organization = await organization.populate([
          {
            path: "members.userId",
            select: "firstName lastName email profileImage clerkId",
          },
          {
            path: "createdBy",
            select: "firstName lastName email profileImage",
          },
        ]);

        responseMessage = "Member removed successfully";
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

    const organization = await Organization.findOne({ slug })
      .populate({
        path: "members.userId",
        select: "firstName lastName email profileImage clerkId",
      })
      .populate({
        path: "createdBy",
        select: "firstName lastName email profileImage",
      });

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

module.exports = {
  handleOrganizationWebhook,
  sendSingleOrganizationDetails,
};
