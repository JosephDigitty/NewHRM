import mongoose from "mongoose";

const recordsSchema = new mongoose.Schema({
    employeeid: { type: mongoose.Schema.Types.ObjectId, ref: "Employee"},
    title: {type:String, required:true},
    description: {type: String, required:true},
    Date: {type: String, required: true},
    type: {type: String, required: true },
    status: {type: String, required: true, enum: ['Open', 'Under Review', 'Resolved', 'Closed']},
    actionTaken: {type: String},
    employeeResponse: {type: String},
    document: {type:String},
    documentPublicId: {type:String},
    severity: {type:String},
    caseId: {type:String},
    
})

const records = mongoose.model("record", recordsSchema ) 

export default records 