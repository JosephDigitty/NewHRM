import mongoose, { mongo } from "mongoose";

const LeaveBalanceSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  leaveType: { type: mongoose.Schema.Types.ObjectId, ref: "leaveType", required: true },

  totalDays: { type: Number, required: true },    
  usedDays: { type: Number, default: 0 },          
  remainingDays: { type: Number, required: true }, 

  year: { type: Number, default: new Date().getFullYear() },
});

LeaveBalanceSchema.index(
  { employee: 1, leaveType: 1, year: 1 },
  { unique: true }
);

const LeaveBalance = mongoose.model("LeaveBalance", LeaveBalanceSchema)
export default LeaveBalance
