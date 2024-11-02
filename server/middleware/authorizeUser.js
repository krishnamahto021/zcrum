const { getAuth } = require("@clerk/express");
const User = require("../models/userSchema");

module.exports.authorizeUser = async (req, res, next) => {
  try {
    const auth = getAuth(req);

    if (!auth || !auth.userId) {
      return res.status(401).send({
        success: false,
        message: "Unauthorized: No user ID found in request",
      });
    }

    const user = await User.findOne({ clerkId: auth.userId });

    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "User not found" });
    }

    // Store only the user ID in req.user
    req.user = user._id;
    next();
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Authorization error",
      error: error.message,
    });
  }
};
