import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    fullname: {type: String, required:true},
    email: {type: String, required:true, unique: true},
    password: {type: String, required:true},
    role: {type: String, enum:['admin', 'employee', 'HR', 'team-lead'], required:true},
    profileImage: {type: String},
    createAt: {type: Date, default:Date},
    updatedAt: {type: Date, default:Date},
})

const User = mongoose.model('User', userSchema)

export default User;