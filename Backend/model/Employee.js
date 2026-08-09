import mongoose from "mongoose";
import User from "./user.js";

const employeeSchema = new mongoose.Schema({
    employeeId: { type: String, unique: true },
    personal: {
    fullName: String,
    dob: Date,
    gender: String,
    maritalStatus: String,
    password: String,
    address: String,
    phone: String,
    emergencyContact: {
      name: String,
      relationship: String,
      phone: String,
    },
  },
  job: {
    role: String,
    dateOfHire: Date,
    employmentType: String,
    position: String,
    department: { type: mongoose.Schema.Types.ObjectId, ref: "Department"},
    reportingTo: String,
    workShift: String,
    workLocation: String,
    bankName: String,
    bankAccountNumber: String,
    grade: { type: mongoose.Schema.Types.ObjectId, ref: "Grade" },
  },
  documents: {
    offerLetter: String,
    resume: String,
    nationalId: String,
    passport: String,
  },
  salaryModifiers: {
    allowances: [{label: { type: String },amount: { type: Number },},],
    deductions: [{label: { type: String },amount: { type: Number },},],
    },
  beneficiary: [{name: { type: String, required: true }, relationship: { type: String } }],
  totalRatedTasks: { type: Number, default: 0 },
  hmo: { type: mongoose.Schema.Types.ObjectId, ref: "Hmo" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  role:String
}, { timestamps: true })

const Employee = mongoose.model('Employee', employeeSchema)

export default Employee

