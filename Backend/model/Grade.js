import mongoose from "mongoose";

const GradeSchema = new mongoose.Schema({
    gradeName: {type: String, required: true, unique: true},
    basicSalary: {type: Number, required: true},
    housingAllowance: { type: Number},
    wardrobeAllowance: { type: Number},
    transportAllowance: { type: Number},
    medicalAllowance: { type: Number},
})

const Grade = mongoose.model("Grade" , GradeSchema)

export default Grade

