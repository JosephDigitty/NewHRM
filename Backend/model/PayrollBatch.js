import mongoose from "mongoose";

const auditEntrySchema = new mongoose.Schema({
    action: {type: String, required: true}, 
    actor: {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        fullname: String,
        role: String,
    },
     comment: String,
     timestamp: { type: Date, default: Date.now },

}, { _id: false })

const decisionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    fullname: String,
    decision: { type: String, enum: ["Approved", "Rejected"] },
    comment: String,
    decidedAt: Date,
},{ _id: false })

const payrollBatchSchema = new mongoose.Schema({
    period: {
        type: String,
        required: true,
        unique: true,          
        match: /^\d{4}-\d{2}$/, // "2026-09"
    },
    payrollPeriodName: { type: String, required: true },
    status: {
        type: String,
        enum: [
            "Draft",
            "Pending Accounts Review",
            "Pending Director Review",
            "Approved",
            "Paid",
            "Rejected By Accounts",
            "Rejected By MD",
        ],
        default: "Draft",
    },

    preparedBy: {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        fullname: String,
        role: String,
    },
    accountsReview: decisionSchema,
    mdApproval: decisionSchema,
    
    submittedAt: Date,
    publishedAt: Date,

    totals: {
        totalEmployees: { type: Number, default: 0 },
        grossPayroll: { type: Number, default: 0 },
        totalDeductions: { type: Number, default: 0 },
        totalNetPay: { type: Number, default: 0 },
    },

    auditTrail: [auditEntrySchema],
} , { timestamps: true })

const payrollBatch = mongoose.model("PayrollBatch", payrollBatchSchema)

export default payrollBatch