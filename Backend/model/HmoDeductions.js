import mongoose from "mongoose";
import { Schema } from "mongoose";

const HmoDeductionSchema = new mongoose.Schema({
    employeeId: {type: Schema.Types.ObjectId, ref: 'Employee', required: true},
    period: { type: String, required: true },
    amount:{type: Number, required: true},
    payrollId: { type: mongoose.Schema.Types.ObjectId, ref: "Payroll" },
    name: {type: String}
})
HmoDeductionSchema.index({ employeeId: 1, period: 1 }, { unique: true });

const HmoDeductions = mongoose.model("HmoDeductions", HmoDeductionSchema)
export default HmoDeductions