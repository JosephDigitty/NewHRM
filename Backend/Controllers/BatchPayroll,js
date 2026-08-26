
import Payroll from "../model/Payroll.js";
import payrollBatch from "../model/PayrollBatch.js";
import User from "../model/user.js";

const getLatestBatch = async (req, res) => {
    try {
        const batch = await payrollBatch.findOne().sort({ createdAt: -1 });

        if (!batch) {
            return res.status(404).json({ success: false, error: "No payroll batch found" });
        }

        return res.status(200).json({ success: true, batch });
    } catch (error) {
        console.error("Error fetching latest batch:", error);
        return res.status(500).json({ success: false, error: "Server error fetching latest batch" });
    }
};

const submitPayrollForReview = async (req, res) => {
    try {
        const { batchId, userId } = req.body;

        if (!batchId) {
            return res.status(400).json({ success: false, error: "batchId is required" });
        }

        const batch = await payrollBatch.findById(batchId);
        if (!batch) {
            return res.status(404).json({ success: false, error: "Payroll batch not found" });
        }

        const submittableStatuses = ["Draft", "Rejected By Accounts", "Rejected By MD"];
        if (!submittableStatuses.includes(batch.status)) {
            return res.status(400).json({
                success: false,
                error: `Cannot submit a batch in status "${batch.status}"`,
            });
        }

        const user = await User.findById(userId);

        batch.status = "Pending Accounts Review";
        batch.submittedAt = new Date();
        batch.auditTrail.push({
            action: "Submitted for Review",
            actor: {
                userId: user?._id,
                name: user?.fullname,
                role: user?.role,
            },
        });

        await batch.save();

        await Payroll.updateMany({ batchId }, { status: "Pending Accounts Review" });

        return res.status(200).json({
            success: true,
            message: "Payroll submitted for accounts review",
            batch,
        });
    } catch (error) {
        console.error("Error submitting payroll for review:", error);
        return res.status(500).json({ success: false, error: "Server error submitting payroll" });
    }
};



const getBatchByPeriod = async (req, res) => {
    try {
        const { period } = req.body;

        if (!period) {
            return res.status(400).json({ success: false, error: "Period (YYYY-MM) is required" });
        }

        const batch = await payrollBatch.findOne({ period });

        if (!batch) {
            return res.status(404).json({ success: false, error: `No payroll batch found for period ${period}` });
        }

        return res.status(200).json({ success: true, batch });
    } catch (error) {
        console.error("Error fetching batch by period:", error);
        return res.status(500).json({ success: false, error: "Server error fetching batch" });
    }
}; 

const acceptPayroll = async (req, res) => {
    try {
        const { batchId, userId } = req.body;

        if (!batchId) {
            return res.status(400).json({ success: false, error: "batchId is required" });
        }

        const batch = await payrollBatch.findById(batchId);
        if (!batch) {
            return res.status(404).json({ success: false, error: "Payroll batch not found" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, error: "User not found" });
        }

        // Stage 1: Accounts reviews the numbers -> PendingDirectorReview
        if (batch.status === "Pending Accounts Review" && user.authorisation === "Account") {
            batch.status = "Pending Director Review";
            batch.accountsReview = {
                userId: user._id,
                fullname: user.fullname,
                decision: "Approved",
                decidedAt: new Date(),
            };
            batch.auditTrail.push({
                action: "Accounts Approved",
                actor: { userId: user._id, name: user.fullname, role: user.authorisation },
            });

        // Stage 2: Director approves -> Approved
        } else if (batch.status === "Pending Director Review" && user.authorisation === "Director") {
            batch.status = "Approved";
            batch.mdApproval = {
                userId: user._id,
                fullname: user.fullname,
                decision: "Approved",
                decidedAt: new Date(),
            };
            batch.auditTrail.push({
                action: "Director Approved",
                actor: { userId: user._id, name: user.fullname, role: user.authorisation },
            });

        // Stage 3: Accounts confirms payment has actually been made -> Paid (locked)
        } else if (batch.status === "Approved" && user.authorisation === "Account") {
            batch.status = "Paid";
            batch.publishedAt = new Date();
            batch.auditTrail.push({
                action: "Payment Confirmed",
                actor: { userId: user._id, name: user.fullname, role: user.authorisation },
                comment: "Payroll marked as paid",
            });

        } else {
            return res.status(403).json({
                success: false,
                error: `You are not authorised to accept this payroll at its current status "${batch.status}"`,
            });
        }

        await batch.save();
        await Payroll.updateMany({ batchId }, { status: batch.status });

        return res.status(200).json({
            success: true,
            message: "Payroll accepted",
            batch,
        });
    } catch (error) {
        console.error("Error accepting payroll:", error);
        return res.status(500).json({ success: false, error: "Server error accepting payroll" });
    }
};



export {getBatchByPeriod, getLatestBatch, submitPayrollForReview, acceptPayroll}