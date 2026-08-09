import mongoose from "mongoose"

const connectToDatabase = async () => {
    
    try {
        await mongoose.connect(process.env.MONGO_DB_URL)
        
    } catch (error) {
        console.error(`Error connecting to the database: ${error.message}`)
        process.exit(1)
        
    }
}

export default connectToDatabase