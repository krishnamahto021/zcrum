const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    status: {
      type: String,
      enum: ["OPEN", "IN_PROGRESS", "DONE"],
      default: "OPEN",
      required: true,
    },
    order: { type: Number, required: true },
    priority: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"], // Adjust based on your priorities
      required: true,
    },
    assigneeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    reporterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    sprintId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sprint",
      default: null,
    },
  },
  { timestamps: true }
);

// Index to optimize queries by `status` and `order`
issueSchema.index({ status: 1, order: 1 });

const Issue = mongoose.model("Issue", issueSchema);
module.exports = Issue;