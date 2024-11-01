const { Webhook } = require("svix");
const User = require("../../models/userSchema");
const { sendResponse } = require("../../utils/sendResponse");

const userHookToLinkWithClerk = async (req, res) => {
  // Get the headers
  const svix_id = req.headers["svix-id"];
  const svix_timestamp = req.headers["svix-timestamp"];
  const svix_signature = req.headers["svix-signature"];

  // If there are missing headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return sendResponse(res, 400, false, "Missing required Svix headers");
  }

  // Get the body as raw text for verification
  const payload = req.body;
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your webhook secret
  const wh = new Webhook(process.env.WEBHOOK_SECRET);

  let evt;

  // Verify the payload with Svix
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
    email_addresses,
    first_name,
    last_name,
    image_url,
    phone_numbers,
  } = evt.data;

  try {
    // Handle different webhook events
    switch (type) {
      case "user.created": {
        const newUser = await User.create({
          clerkId: id,
          email: email_addresses[0]?.email_address,
          firstName: first_name || "",
          lastName: last_name || "",
          isVerified: true,
          profileImage: image_url,
          phone: phone_numbers[0],
        });
        return sendResponse(res, 200, true, "User created successfully", {
          user: newUser,
        });
      }

      case "user.updated": {
        const updatedUser = await User.findOneAndUpdate(
          { clerkId: id },
          {
            email: email_addresses[0]?.email_address,
            firstName: first_name || "",
            lastName: last_name || "",
          },
          { new: true }
        );

        console.log("User updated successfully:", updatedUser);
        return sendResponse(res, 200, true, "User updated successfully", {
          user: updatedUser,
        });
      }

      case "user.deleted": {
        await User.findOneAndDelete({ clerkId: id });
        console.log("User deleted successfully:", id);
        return sendResponse(res, 200, true, "User deleted successfully", {
          userId: id,
        });
      }

      default: {
        console.log(`Unhandled webhook event type: ${type}`);
        return sendResponse(res, 200, true, `Unhandled event type: ${type}`);
      }
    }
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

module.exports = { userHookToLinkWithClerk };
