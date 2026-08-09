import mongoose from "mongoose";
import { Schema } from "mongoose";


const leaveSchema = new mongoose.Schema({
    employeeId: {type: Schema.Types.ObjectId, ref: 'Employee', required: true},
    leaveType: {type: String, required: true, enum: ['Sick Leave', 'Causal Leave', 'Annual Leave']},
    startDate: {type: Date, required: true},
    endDate: {type: Date, required: true},
    reason: {type: String, required: true},
    status: {type: String, required: true, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending'},
    createdAt: {type: Date, default:Date.now},
    updatedAt: {type: Date, default:Date.now},
})

const Leave = mongoose.model('Leave', leaveSchema)
export default Leave