import mongoose from "mongoose";

const AppraisalCycleSchema = new mongoose.Schema({
    cycleName: String,
    startDate: Date,
    endDate: Date,
    status: {
        type: String,
        enum: ['open', 'closed'],
        default: 'open'
    }
}, {timestamps: true});

const AppraisalCycle = mongoose.model("AppraisalCycle", AppraisalCycleSchema)

export default AppraisalCycle