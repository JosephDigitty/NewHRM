import Employee from "../model/Employee.js"
import Leave from "../model/leave.js"

const addLeave = async (req, res) => {
    try{
        const {userId, leaveType, startDate, endDate, reason} = req.body
        const employee = await Employee.findOne({userId})
        const newLeave = new Leave({employeeId:employee._id, leaveType, startDate, endDate, reason})
        await newLeave.save()
        res.status(201).json({success: true, leave: newLeave})
    } catch(error) {
        console.error("Error adding Leave:", error);
        res.status(500).json({success:false, error: "add New Leave Error"})
    }
}

export {addLeave}