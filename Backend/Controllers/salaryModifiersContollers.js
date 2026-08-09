import Employee from "../model/Employee.js"

const updateSalaryModifiers = async (req, res) => {
    try {
        const {allowance, deduction, id} = req.body
        const employee = await Employee.findOne(id)

        if (!employee) {
            return res.status(404).json({success: false, message: "employee not found"})
        }

        employee.salaryModifiers = {allowance: allowance || [], deduction: deduction || []}
        const updatedEmployee = await employee.save()
        res.status(200).json({success: true, message: "employee updated successfully", updatedEmployee})
    } catch (error) {
        res.status(500).json({success: false, message: "error Adding Salary Modifiers"})
    }
}

export {updateSalaryModifiers}
