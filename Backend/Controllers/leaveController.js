import mongoose from "mongoose";
import LeaveBalance from "../model/LeaveBalance.js"
import leaveRequest from "../model/LeaveRequest.js"
import leaveType from "../model/LeaveType.js";

export const leaveApply = async (req, res) => {
  try {
  
    console.log("BACKEND RECEIVED:", req.body);

    const { employeeId, leaveTypeId, startDate, endDate, reason } = req.body;

    if (!employeeId || !leaveTypeId || !startDate || !endDate || !reason) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const numberOfDays =
      Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    const leaveTypes = await leaveType.findById(leaveTypeId);
    if (!leaveTypes) return res.status(404).json({ message: "Leave type not found" })
    
    const leaveBalance = await LeaveBalance.findOne({
      employee: employeeId,
      leaveType: leaveTypeId,
      year: new Date().getFullYear(),
    });
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    if (!leaveBalance) return res.status(400).json({ message: "No leave balance found for this type" });
    if (leaveBalance.remainingDays < numberOfDays) {
      return res.json({ success: false, message: "Insufficient leave balance" });
    }
    const leaveRequests = new leaveRequest({
      employee: employeeId,
      leaveType: leaveTypeId,
      startDate: start,
      endDate: end,
      numberOfDays,
      reason,
      status: "pending",
    });

    await leaveRequests.save()
    res.status(201).json({
      success: true,
      message: "Leave request submitted",
      leaveRequests,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const approveLeave = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { id } = req.body;

    const leaveRequests = await leaveRequest.findById(id).session(session);
    if (!leaveRequests) throw new Error("Leave request not found");
    if (leaveRequests.status !== "pending") throw new Error("Leave already processed");

    const leaveBalance = await LeaveBalance.findOne({
      employee: leaveRequests.employee,
      leaveType: leaveRequests.leaveType,
      year: new Date().getFullYear(),
    }).session(session);

    if (!leaveBalance || leaveBalance.remainingDays < leaveRequests.numberOfDays) {
      throw new Error("Insufficient leave balance");
    }

    // Deduct balance
    leaveBalance.usedDays += leaveRequests.numberOfDays;
    leaveBalance.remainingDays -= leaveRequests.numberOfDays;

    leaveRequests.status = "approved";

    await leaveBalance.save({ session });
    await leaveRequests.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.json({ success:true, message: "Leave approved successfully", leaveRequest });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ message: err.message });
  }
};

export const rejectLeave = async (req, res) => {
  try {
    const { id } = req.body;

    const leaveRequests = await leaveRequest.findById(id);
    if (!leaveRequests) return res.status(404).json({ message: "Leave request not found" });
    if (leaveRequests.status !== "pending") return res.status(400).json({ message: "Leave already processed" });

    leaveRequests.status = "rejected";
    await leaveRequests.save();

    res.json({ success:true,  message: "Leave rejected successfully", leaveRequests });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMyLeaveRequests = async (req, res) => {
  try {
    const leaveRequests = await LeaveRequest.find({ employee: req.user._id })
      .populate("leaveType")
      .populate("approvedBy", "name");

    res.json(leaveRequests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getLeaveTypes = async (req, res) => {
  try {
    const leaveTypes = await leaveType.find({}, "_id name daysPerYear").sort({ name: 1 });
    res.status(200).json({success: true,  message:"leaveType Fetch Successfull", leaveTypes});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllLeave = async (req, res) => {
  try {
    const leave = await leaveRequest
      .find()
      .populate({
        path: "employee",
        select: "-password" // remove sensitive fields
      })
      .populate("leaveType")
      .sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      message: "All Leave request fetched successfully",
      leave
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({
      success: false,
      message: "Leave Request Fetch Server Error"
    })
  }
}

export const getLeave = async (req, res) => {
  const {id} = req.body
  try {
    const leave = await leaveRequest
      .findById(id)
      .populate({
        path: "employee",
        select: "-password" // remove sensitive fields
      })
      .populate("leaveType")
      .sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      message: "All Leave request fetched successfully",
      leave
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({
      success: false,
      message: "Leave Request Fetch Server Error"
    })
  }
}

export const getEmployeeLeave = async (req, res) => {
  try {
    const {id} = req.body 
    const leave = leaveRequest.find(id)
    .sort({createdAt: -1})
    res.status(200).json({
      success: true,
      message: "Employee Leave request fetched successfully",
      leave
    })
  } catch (error) {
    console.error(err)
    res.status(500).json({
      success: false,
      message: "Leave Request Fetch Server Error"
    })
  }
} 

export const getEmployeeLeaveBalances = async (req, res) => {
  try {
    const { id } = req.params;
    const year = Number(req.query.year) || new Date().getFullYear();

    const leaveBalances = await LeaveBalance.find({
      employee: id,
      year,
    })
      .populate("leaveType") 
      .populate({
        path:"employee",
        select:'-password'
      }); 

    if (!leaveBalances.length) {
      return res.status(400).json({
        success: false,
        message: "No leave balances found for this employee",
      });
    }

    res.status(200).json({
      success: true,
      year,
      leaveBalances,
      message:'leave Balances fetch succesfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch leave balances",
      error: error.message,
    });
  }
};
