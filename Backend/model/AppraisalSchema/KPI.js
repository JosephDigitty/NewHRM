import mongoose from "mongoose";

const KpiItemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },

    description: String,

    weight: {
        type: Number,
        required: true
    },

    metric: String,

    target: String,

    selfScore: {
        type: Number,
        min: 0,
        max: 5
    },

    selfComment: {
        type: String
    },

    supervisorScore: {
        type: Number,
        min: 0,
        max: 5
    },

    supervisorComment: {
        type: String
    },

}, { _id: true });


const AppraisalSchema = new mongoose.Schema({

    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
        required: true
    },

    supervisor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee"
    },

    cycle: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AppraisalCycle",
        required: true
    },

    kpis: [KpiItemSchema],

    results: {
    averageSelfScore: Number,
    averageSupervisorScore: Number,
    finalScore: Number,
    rating: String
  },

    totalScore: Number,

    rating: String,

    status: {
        type: String,
        enum: [
            "Awaiting Appraisal",
            "Awaiting supervisor review",
            "Appraised"
        ],
        default: "Awaiting Appraisal"
    },

    overallFinalComment: String,
    supervisorFinalComment: String


}, { timestamps: true });


const Appraisal = mongoose.model("Appraisal", AppraisalSchema);

export default Appraisal