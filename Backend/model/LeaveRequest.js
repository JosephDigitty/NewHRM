import mongoose from "mongoose";

const LeaveRequestSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  leaveType: { type: mongoose.Schema.Types.ObjectId, ref: "leaveType", required: true },

  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },

  numberOfDays: { type: Number, required: true },
  reason: {type: String, required:true}, 
  status: { 
    type: String, 
    enum: ["pending", "approved", "rejected"], 
    default: "pending" 
  },

  hrRemark: { type: String },
  
  createdAt: { type: Date, default: Date.now },
});
 const leaveRequest = mongoose.model("leaveRequest", LeaveRequestSchema)

 export default leaveRequest