import CashRequisition from "../model/CashRequisition.js";
import User from "../model/user.js";


const createCashRequisition = async (req, res) => {

  try {
    console.log(req.body)
    const {
      userId,
      requestTitle,
      requestCategory,
      amountRequested,
      requiredDate,
      department,
      purpose,
    } = req.body;

    // ==========================================
    // VALIDATE USER
    // ==========================================

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ==========================================
    // VALIDATE REQUEST
    // ==========================================

    if (
      !requestTitle ||
      !requestCategory ||
      !amountRequested ||
      !requiredDate ||
      !department ||
      !purpose
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // ==========================================
    // VALIDATE USER LEVEL
    // ==========================================

   const requesterLevel = ["A", "B", "C"].includes(user.level)
      ? user.level
      : "A";

    // ==========================================
    // DETERMINE INITIAL STATUS
    // ==========================================

    let status;

    if (user.level === "A") {
      status = "PendingLevelBApproval";
    } else if (user.level === "B") {
      status = "PendingHRApproval";
    } else if (user.level === "C") {
      status = "PendingHRApproval";
    }

    // ==========================================
    // CREATE REQUISITION
    // ==========================================

    const requisition = await CashRequisition.create({
      createdBy: user._id,
      requesterLevel: user.level,

      requestTitle,
      requestCategory,
      amountRequested: Number(amountRequested),
      requiredDate,
      department,
      purpose,

      status,
    });

    return res.status(201).json({
      success: true,
      message: "Cash requisition created successfully",
      requisition,
    });

  } catch (error) {
    console.error("Create Cash Requisition Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create cash requisition",
      error: error.message,
    });
  }
};

const submitCashRequisition = async (req, res) => {
  try {
    const { id } = req.params;

    const requisition = await CashRequisition.findById(id);

    if (!requisition) {
      return res.status(404).json({
        message: "Cash requisition not found",
      });
    }

    // Only the person who created the requisition can submit it
    if (requisition.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not authorized to submit this requisition",
      });
    }

    // Only Draft requisitions can be submitted
    if (requisition.status !== "Draft") {
      return res.status(400).json({
        message: "This requisition has already been submitted",
      });
    }

    // Determine first approval stage
    if (req.user.level === "A") {
      requisition.status = "PendingLevelBApproval";
    } else if (req.user.level === "B") {
      requisition.status = "PendingHRApproval";
    } else if (req.user.level === "C") {
      requisition.status = "PendingHRApproval";
    } else {
      return res.status(400).json({
        message: "Invalid user level",
      });
    }

    await requisition.save();

    return res.status(200).json({
      success: true,
      message: "Cash requisition submitted successfully",
      requisition,
    });
  } catch (error) {
    console.error("Submit Cash Requisition Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to submit cash requisition",
      error: error.message,
    });
  }
};


const approveCashRequisition = async (req, res) => {
  try {
    const { id } = req.params;

    const requisition = await CashRequisition.findById(id);

    if (!requisition) {
      return res.status(404).json({
        message: "Cash requisition not found",
      });
    }

    // ==========================================
    // LEVEL B APPROVAL
    // ==========================================

    if (
      requisition.status === "PendingLevelBApproval" &&
      req.user.level === "B"
    ) {
      requisition.status = "PendingHRApproval";

      await requisition.save();

      return res.status(200).json({
        success: true,
        message: "Requisition approved by Level B",
        requisition,
      });
    }


    // ==========================================
    // HR APPROVAL
    // ==========================================

    if (
      requisition.status === "PendingHRApproval" &&
      req.user.role === "admin"
    ) {
      // If requester is Level C,
      // skip Level C approval and go to Accounts
      if (requisition.requesterLevel === "C") {
        requisition.status = "PendingAccountReview";
      } else {
        requisition.status = "PendingLevelC";
      }

      await requisition.save();

      return res.status(200).json({
        success: true,
        message: "Requisition approved by HR",
        requisition,
      });
    }


    // ==========================================
    // LEVEL C APPROVAL
    // ==========================================

    if (
      requisition.status === "PendingLevelC" &&
      req.user.level === "C"
    ) {
      requisition.status = "PendingAccountReview";

      await requisition.save();

      return res.status(200).json({
        success: true,
        message: "Requisition approved by Level C",
        requisition,
      });
    }


    // ==========================================
    // ACCOUNTS APPROVAL / PAYMENT
    // ==========================================

    if (
      requisition.status === "PendingAccountReview" &&
      req.user.authorisation === "Account"
    ) {
      requisition.status = "Paid";

      await requisition.save();

      return res.status(200).json({
        success: true,
        message: "Requisition processed by Accounts",
        requisition,
      });
    }


    // ==========================================
    // UNAUTHORIZED ACTION
    // ==========================================

    return res.status(403).json({
      success: false,
      message: "You are not authorized to approve this requisition",
    });

  } catch (error) {
    console.error("Approve Cash Requisition Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to process requisition",
      error: error.message,
    });
  }
};



const rejectCashRequisition = async (req, res) => {
  try {
    const { id } = req.params;

    const requisition = await CashRequisition.findById(id);

    if (!requisition) {
      return res.status(404).json({
        message: "Cash requisition not found",
      });
    }

    // Level B rejection
    if (
      requisition.status === "PendingLevelBApproval" &&
      req.user.level === "B"
    ) {
      requisition.status = "RejectedByLevelB";
    }

    // HR rejection
    else if (
      requisition.status === "PendingHRApproval" &&
      req.user.role === "admin"
    ) {
      requisition.status = "RejectedByHR";
    }

    // Level C rejection
    else if (
      requisition.status === "PendingLevelC" &&
      req.user.level === "C"
    ) {
      requisition.status = "RejectedByLevelC";
    }

    // Accounts rejection
    else if (
      requisition.status === "PendingAccountReview" &&
      req.user.authorisation === "Account"
    ) {
      requisition.status = "RejectedByAccounts";
    }

    else {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to reject this requisition",
      });
    }

    await requisition.save();

    return res.status(200).json({
      success: true,
      message: "Cash requisition rejected",
      requisition,
    });

  } catch (error) {
    console.error("Reject Cash Requisition Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to reject requisition",
      error: error.message,
    });
  }
};


// ==========================================
// GET ALL CASH REQUISITIONS
// ==========================================

const getAllCashRequisitions = async (req, res) => {
  try {
    const requisitions = await CashRequisition.find()
      .populate("createdBy", "fullname email level role department")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      requisitions,
    });

  } catch (error) {
    console.error("Get Cash Requisitions Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch cash requisitions",
      error: error.message,
    });
  }
};


const getCashRequisitionById = async (req, res) => {
  try {
    const { id } = req.params;

    const requisition = await CashRequisition.findById(id)
      .populate("createdBy", "fullname email level role department");

    if (!requisition) {
      return res.status(404).json({
        message: "Cash requisition not found",
      });
    }

    return res.status(200).json({
      success: true,
      requisition,
    });

  } catch (error) {
    console.error("Get Cash Requisition Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch cash requisition",
      error: error.message,
    });
  }
};


export {createCashRequisition}