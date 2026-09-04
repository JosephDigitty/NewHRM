import mongoose from "mongoose";

const AppraisalCycleSchema = new mongoose.Schema({
    Cyclename: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
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
      enum: ["draft", "active", "closed", "archived"],
      default: "draft",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, 

}, {timestamps: true});

const AppraisalCycle = mongoose.model("AppraisalCycle", AppraisalCycleSchema)

export default AppraisalCycle



