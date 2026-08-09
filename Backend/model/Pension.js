import mongoose from "mongoose";
import { Schema } from "mongoose";

const PensionSchema = new mongoose.Schema({
    name: {type: String},
    employeeId: {type: Schema.Types.ObjectId, ref: 'Employee', required: true},
    period: { type: String, required: true },
    amount:{type: Number, required: true},
    payrollId: { type: mongoose.Schema.Types.ObjectId, ref: "Payroll" },
})
PensionSchema.index({ employeeId: 1, period: 1 }, { unique: true });

const Pension = mongoose.model('Pension', PensionSchema)
export default Pension
