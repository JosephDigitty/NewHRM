import mongoose, { Schema } from "mongoose";

const HMOSchema = new mongoose.Schema({
    amount: {type: Number},
    name: {type: String}
})

const Hmo = mongoose.model("Hmo", HMOSchema)

export default Hmo