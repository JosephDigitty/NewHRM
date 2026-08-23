import jwt from "jsonwebtoken"
import user from "../model/user.js"
import bcrypt from 'bcrypt'
import { validationResult } from "express-validator"

export const login = async (req, res) => {
    try{
        console.log("Payload Recieved", req.body)
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({
            success: false,
            errors: errors.array(),
            });
        }
        const {email, password} = req.body
        const existingUser = await user.findOne({email})
        if(!existingUser){
            return res.status(404).json({sucess:false, error: "User Not Found"})
        }
        const isMatch = await bcrypt.compare(password, existingUser.password)
        if(!isMatch){
            return res.status(400).json({success: false, error: "Invalid Password"})
            
        }

        const token = jwt.sign({_id: existingUser._id, role: existingUser.role},
            process.env.JWT_KEY,
            {expiresIn: '10d'}
        )
        res.status(200).json({success: true, token, user:{_id: existingUser._id, role: existingUser.role, fullname:existingUser.fullname, authorisation:existingUser.authorisation}})

    } catch(err){
        res.status(500).json({error: err.message})
      
    }
}
export const verify = (req, res) => {
    return res.status(200).json({success: true, user: req.user})
}