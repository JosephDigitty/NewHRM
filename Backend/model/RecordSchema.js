import mongoose from "mongoose";

const recordsSchema = new mongoose.Schema(
  {
    employeeid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    Date: { type: String, required: true },
    type: { type: String, required: true },
    status: {
      type: String,
      required: true,
      enum: ["Open", "Under Review", "Resolved", "Closed"],
      default: "Open",
    },
    caseID: { type: String },
    location: { type: String },
    actionTaken: { type: String },
    employeeResponse: { type: String },
    documents: [
    {
    url: { type: String, required: true },
    publicId: { type: String },
    name: { type: String },
    size: { type: Number },
    }
  ],
    severity: { type: String },
  },
  { timestamps: true }
);

const records = mongoose.model("Record", recordsSchema);

export default records