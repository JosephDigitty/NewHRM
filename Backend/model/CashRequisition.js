import mongoose from "mongoose";

const cashRequisitionSchema = new mongoose.Schema(
  {
    // Requester
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    requesterLevel: {
      type: String,
      enum: ["A", "B", "C"],
      required: true,
    },

    // Request details
    requestTitle: {
      type: String,
      required: true,
      trim: true,
    },

    requestCategory: {
      type: String,
      enum: ["travel", "petty_cash", "supplies"],
      required: true,
    },

    amountRequested: {
      type: Number,
      required: true,
      min: 0,
    },

    requiredDate: {
      type: Date,
      required: true,
    },

    department: {
      type: String,
      required: true,
    },

    purpose: {
      type: String,
      required: true,
      trim: true,
    },

    // Cloudinary documents
    supportingDocuments: [
      {
        fileName: String,
        fileUrl: String,
        publicId: String,
      },
    ],

    // Workflow
    status: {
      type: String,
      enum: [
        "Draft",
        "PendingLevelBApproval",
        "PendingHRApproval",
        "PendingLevelC",
        "PendingAccountReview",
        "Paid",
        "Rejected",
      ],
      default: "Draft",
    },
  },
  {
    timestamps: true,
  }
);

const CashRequisition = mongoose.model("CashRequest",cashRequisitionSchema)

export default CashRequisition