import Department from "../model/Department.js";

const addDepartment = async (req, res) => {
    // Add code here to add a new department
    try {
       
        const {department_Name, description} = req.body
        const newDepartment = new Department({
            department_Name,
            description
        })
        await newDepartment.save()
        res.status(201).json({success: true, department: newDepartment})
    } catch(error) {
        console.error("Error adding department:", error);
        res.status(500).json({success:false, error: "add department server error"})
    }
}
const getAllDepartments = async (req, res) => {
   try {
       const departments = await Department.find()
       res.status(200).json({success: true, departments})
   } catch (error) {
       console.error("Error fetching departments:", error);
       res.status(500).json({success:false, error: "fetch departments server error"})
   }
}


const getDepartment = async (req, res) => {
    try {
        const id = req.params.id
        const department = await Department.findById(id)
        res.status(200).json({success: true, department})
    } catch (error) {
        console.error("Error fetching department:", error);
        res.status(500).json({success:false, error: "fetch department server error"})
    }
}

const editDepartment = async (req, res) => {
    try{
        const id = req.params.id
        const {department_Name, description} = req.body
        const updatedDepartment = await Department.findByIdAndUpdate(id, {department_Name, description}, {new: true})
        res.status(200).json({success: true, department: updatedDepartment})
    } catch (error) {
        console.error("Error updating department:", error);
        res.status(500).json({success:false, error: "update department server error"})
    }
}
const deleteDepartment = async (req, res) => {
        try{
            const id = req.params.id
            const deletedDepartment = await Department.findByIdAndDelete(id);
            if(!deletedDepartment) {
                return res.status(404).json({success: false, messsage: "couldnt fine department"})
            } 
            res.status(200).json({success:true, message:`${deleteDepartment.department_Name} succesfully deleted`,deletedDepartment})

        } catch (error) {
            res.status(500).json({success:false, message:"error deleting department"})
            console.log(error)
        }
}
export  {addDepartment , getAllDepartments , getDepartment, editDepartment, deleteDepartment};
