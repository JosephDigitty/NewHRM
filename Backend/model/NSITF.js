import mongoose from "mongoose";
import { Schema } from "mongoose";

const NSITFSchema = new mongoose.Schema({
    employeeId: {type: Schema.Types.ObjectId, ref: 'Employee', required: true},
    period: { type: String, required: true },
    amount:{type: Number, required: true},
    payrollId: { type: mongoose.Schema.Types.ObjectId, ref: "Payroll" },
    name: {type: String}
})
NSITFSchema.index({ employeeId: 1, period: 1 }, { unique: true });

const NSITF = mongoose.model('NSITF', NSITFSchema)
export default NSITF