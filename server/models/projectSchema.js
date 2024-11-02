const mongoose = require("mongoose");
const { Schema } = mongoose;

const projectSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    key: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    sprints: [
      {
        type: Schema.Types.ObjectId,
        ref: "Sprint",
      },
    ],
    issues: [
      {
        type: Schema.Types.ObjectId,
        ref: "Issue",
      },
    ],
  },
  { timestamps: true }
);

// Creating a unique index on `organizationId` and `key`
projectSchema.index({ organizationId: 1, key: 1 }, { unique: true });

module.exports = mongoose.model("Project", projectSchema);
