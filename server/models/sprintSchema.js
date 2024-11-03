const mongoose = require("mongoose");

const sprintSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["PLANNED", "IN_PROGRESS", "COMPLETED", "CANCELLED"],
      default: "PLANNED",
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    // issues: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Issue",
    //   },
    // ],
  },
  {
    timestamps: true,
  }
);

const Sprint = mongoose.model("Sprint", sprintSchema);

module.exports = Sprint;
