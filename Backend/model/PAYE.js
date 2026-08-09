import mongoose from "mongoose";
import { Schema } from "mongoose";

const PAYESchema = new mongoose.Schema({
    employeeId: {type: Schema.Types.ObjectId, ref: 'Employee', required: true},
    period: { type: String, required: true },
    amount:{type: Number, required: true},
    payrollId: { type: mongoose.Schema.Types.ObjectId, ref: "Payroll" },
    name: {type: String}
})
PAYESchema.index({ employeeId: 1, period: 1 }, { unique: true });

const PAYEE = mongoose.model('PAYE', PAYESchema)
export default PAYEE
