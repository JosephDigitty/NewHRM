import Grade from "../model/Grade.js"

const addGrade = async (req, res) => {
    try {
        const {gradeName, basicSalary, housingAllowance, wardrobeAllowance, transportAllowance,  medicalAllowance} = req.body
        const newGrade = new Grade({gradeName, basicSalary,  housingAllowance, wardrobeAllowance, transportAllowance,  medicalAllowance})
        await newGrade.save()
        res.status(201).json({success: true, grade: newGrade})
        
    } catch (error) {
        res.status(500).json({success:false, error: "add grade server error"})
        console.log(error)
    }

}

const getGrades = async (req, res) => {
    try {
        const grades = await Grade.find()
        res.status(200).json({success: true, grades})
    } catch (error) {
        res.status(500).json({success:false, error: "Fetch all Grade Server Error"})
        console.log(error)
    }
}

export {addGrade, getGrades}