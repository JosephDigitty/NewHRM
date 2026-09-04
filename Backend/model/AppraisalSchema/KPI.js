import mongoose from "mongoose";

const KpiItemSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },


    target: {
      type: String,
      trim: true,
    },

    measurement: {
      type: String,
      trim: true,
    },

    weight: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    order: {
      type: Number,
      default: 0,
    },

    metric: String,

    target: String,

    dueDate: String,

    evidenceSource: String,

    actualAchievement:String,

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


  coreCompetence : {
    Communication: String,
    Teamwork: String,
    AttentionToDetail: String,
    Professionalism: String,
    ClientRelationship: String,
    WorkingSpirit: String,
    DesireToLearn: String,
  },

  overAllAssessment: {
    OverallRating: {String, enum:["Need improvements", "Good", "Very Good", "Excellent", "Oustanding"]},
    FinalScore: String,
    Strenghts: String,
    AreasOfImprovement: String,
    Training: String,
    Bonus: String,
    AdditionalComments: String,
    OverallRecommendation: String,
  },

    status: {
        type: String,
        enum: [
            "awaiting Apporval",
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