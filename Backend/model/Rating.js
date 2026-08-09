import mongoose from "mongoose";


const rating = new mongoose.Schema({
    employeeId: {type: Schema.Types.ObjectId, ref: 'Employee', required: true},
    productivity: { type: Number, default: 0 },
    communication: { type: Number, default: 0 },
    collaboration: { type: Number, default: 0 },
    totalScore: { type: Number, default: 0 },
    feedback: String,
}, {_id: false})

const task = new mongoose.Schema({
  title: String,
  description: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
  inCharge: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" }, 
  assignedMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Employee" }],
  startDate: Date,
  endDate: Date,
  priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
  status: { type: String, enum: ["Pending", "In Progress", "Completed"], default: "Pending" },
}, {timestamps: true})

