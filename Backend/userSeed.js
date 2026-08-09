import connectToDatabase from "./db/db.js"
import User from "./model/user.js"
import bcrypt from 'bcrypt'

export const userRegister = async () => {
    await connectToDatabase()
    try{
        const existingUser = await User.findOne({email: "admin@gmail.com"})
        if (existingUser) {
          
            return
        }
        const hashPassword = await bcrypt.hash("admin", 10)
        const newUser = new User({
            fullname: "Admin",
            email: "admin@gmail.com",
            password: hashPassword,
            role: "admin"
    })
    await newUser.save()
    } catch(e){
        console.error(e)
    }
}

