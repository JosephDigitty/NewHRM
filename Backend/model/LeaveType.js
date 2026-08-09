import mongoose from "mongoose";
const LeaveTypeSchema = new mongoose.Schema({
    name: {
        type: String,
        enum:["Sick", "Annual","Maternity","Education"],
        required:true,
    },
    daysPerYear: {type:Number, required:true}
})
LeaveTypeSchema.index({ name: 1 }, { unique: true });


const leaveType = mongoose.model("leaveType", LeaveTypeSchema)

export default leaveType