import ITF from "../model/ITF.js"
import NSITF from "../model/NSITF.js"
import PAYEE from "../model/PAYE.js"
import Pension from "../model/Pension.js"

const getPensionByPeriod = async (req, res) => {
    try {
        const {payDate} = req.body
        const period = new Date(payDate).toISOString().slice(0, 7)
        const payroll = await Pension.find({period})
        .populate({
            path: "employeeId",
            populate: [
            {
                path: "job.department",
                select: "department_Name"
            },
            {
                path: "job.grade",
                select: "gradeName"
            },
             {
                path: "userId",
                populate: "fullname"
            }
        ] 
        })
        .sort({ createdAt: -1 });
        let filteredPayroll = []
         for (let i = 0; i < payroll.length; i++) {
            if (payroll[i].period === period) {
                filteredPayroll.push(payroll[i])
            }filteredPayroll
        }

        if(!filteredPayroll) {
            return res.status(404).json({success:false, error: "Payroll is not found"})
        }
       
        res.status(200).json({
            success: true,
            message:"pension per period retrieved",
            filteredPayroll
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({success:false, error:"fetch pension server Error"})
    }
}

const getPAYEByPeriod = async (req, res) => {
    try {
        const {payDate} = req.body
        const period = new Date(payDate).toISOString().slice(0, 7)
        const payroll = await PAYEE.find({period}).populate({
            path: "employeeId",
            populate: [
            {
                path: "job.department",
                select: "department_Name"
            },
            {
                path: "job.grade",
                select: "gradeName"
            },
            {
                path: "userId",
                select: "fullname"
            },
        ]
        })
        .sort({ createdAt: -1 });
        let filteredPAYE = []
         for (let i = 0; i < payroll.length; i++) {
            if (payroll[i].period === period) {
                filteredPAYE.push(payroll[i])
            }filteredPAYE
        }

        if(!filteredPAYE) {
            return res.status(404).json({success:false, error: "Payroll is not found"})
        }
        res.status(200).json({
            success: true,
            message:"PAYE the period retrieved",
            filteredPAYE
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({success:false, error:"fetch Payroll server Error"})
    }
}

const getITFByPeriod = async (req, res) => {
    try {
        const {payDate} = req.body
        const period = new Date(payDate).toISOString().slice(0, 7)
        const payroll = await ITF.find({period}).populate({
            path: "employeeId",
            populate:[
            {
                path: "job.department",
                select: "department_Name"
            },
            {
                path: "job.grade",
                select: "gradeName"
            },
            {
                path: "userId",
                select: "fullname"
            },
        ] 
        })
        .sort({ createdAt: -1 });
        let filteredITF = []
         for (let i = 0; i < payroll.length; i++) {
            if (payroll[i].period === period) {
                filteredITF.push(payroll[i])
            }filteredITF
        }

        if(!filteredITF) {
            return res.status(404).json({success:false, error: "Payroll is not found"})
        }
        res.status(200).json({
            success: true,
            message:"Payroll the period retrieved",
            filteredITF
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({success:false, error:"fetch Payroll server Error"})
    }
}

const getNSITFByPeriod = async (req, res) => {
    try {
        const {payDate} = req.body
        const period = new Date(payDate).toISOString().slice(0, 7)
        const payroll = await NSITF.find({period}).populate({
            path: "employeeId",
            populate: [
            {
                path: "job.department",
                select: "department_Name"
            },
            {
                path: "job.grade",
                populate: "gradeName"
            },
            {
                path: "userId",
                populate: "fullname"
            },
        ] 
        })
        .sort({ createdAt: -1 });
        let filteredNSITF = []
         for (let i = 0; i < payroll.length; i++) {
            if (payroll[i].period === period) {
                filteredNSITF.push(payroll[i])
            }filteredNSITF
        }

        if(!filteredNSITF) {
            return res.status(404).json({success:false, error: "Payroll is not found"})
        }
        res.status(200).json({
            success: true,
            message:"Payroll the period retrieved",
            filteredNSITF
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({success:false, error:"fetch Payroll server Error"})
    }
}

const getAllPensionList = async (req, res) => {
    try {
        const payroll = await Pension.find().populate({
            path: "employeeId",
            populate:[
            {
                path: "job.department",
                select: "department_Name"
            },
            {
                path: "job.grade",
                select: "gradeName"
            },
            {
                path: "userId",
                select: "fullname"
            },
        ] 
        }).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            message:"all pension succefully retrived retrieved",
            payroll
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({success:false, error:"fetch Payroll server Error"})
    }
}

const getAllPAYEList = async (req, res) => {
    try {
        const payroll = await PAYEE.find().populate({
            path: "employeeId",
            populate: [
            {
                path: "job.department",
                select: "department_Name"
            },
            {
                path: "job.grade",
                select: "gradeName"
            },
            {
                path: "userId",
                select: "fullname"
            },
        ] 
        }).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            message:"all payee retrieved",
            payroll
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({success:false, error:"fetch Payroll server Error"})
    }
}

const getAllITFList = async (req, res) => {
    try {
        const payroll = await ITF.find().populate({
            path: "employeeId",
            populate:[
            {
                path: "job.department",
                populate: "department_Name"
            },
            {
                path: "job.grade",
                populate: "gradeName"
            },
            {
                path: "userId",
                populate: "fullname"
            },
        ] 
        }).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            message:"all ITFs successfully retrieved",
            payroll
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({success:false, error:"fetch Payroll server Error"})
    }
}


const getAllNSITFList = async (req, res) => {
    try {
        const payroll = await NSITF.find().populate({
            path: "employeeId",
            populate: [
            {
                path: "job.department",
                select: "department_Name"
            },
            {
                path: "job.grade",
                select: "gradeName"
            },
            {
                path: "userId",
                select: "fullname"
            },
            ] 
        }).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            message:"Payroll the period retrieved",
            payroll
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({success:false, error:"fetch Payroll server Error"})
    }
}

const getPensionByEmployee = async (req, res) => {
    try {
        const {employeeId} = req.body
        const payroll = Pension.findOne({employeeId}).populate({
            path: "employeeId",
            populate: {
                path: "job.department",
                populate: "department_Name"
            },
            populate: {
                path: "job.grade",
                populate: "gradeName"
            },
            populate: {
                path: "userId",
                populate: "fullname"
            },
        })
        .sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            message:"Payroll the period retrieved",
            payroll
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({success:false, error:"fetch Payroll server Error"})
    }
}

const getPAYEByEmployee = async (req, res) => {
    try {
        const {employeeId} = req.body
        const payroll = PAYEE.findOne({employeeId}).populate({
            path: "employeeId",
            populate: {
                path: "job.department",
                populate: "department_Name"
            },
            populate: {
                path: "job.grade",
                populate: "gradeName"
            },
            populate: {
                path: "userId",
                populate: "fullname"
            },
        })
        res.status(200).json({
            success: true,
            message:"Payroll the period retrieved",
            payroll
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({success:false, error:"fetch Payroll server Error"})
    }
}

const getITFByEmployee = async (req, res) => {
    try {
        const {employeeId} = req.body
        const payroll = ITF.findOne({employeeId}).populate({
            path: "employeeId",
            populate: {
                path: "job.department",
                populate: "department_Name"
            },
            populate: {
                path: "job.grade",
                populate: "gradeName"
            },
            populate: {
                path: "userId",
                populate: "fullname"
            },
        })
        res.status(200).json({
            success: true,
            message:"Payroll the period retrieved",
            payroll
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({success:false, error:"fetch Payroll server Error"})
    }
}

const getNSITFByEmployee = async (req, res) => {
    try {
        const {employeeId} = req.body
        const payroll = NSITF.findOne({employeeId}).populate({
            path: "employeeId",
            populate: {
                path: "job.department",
                populate: "department_Name"
            },
            populate: {
                path: "job.grade",
                populate: "gradeName"
            },
            populate: {
                path: "userId",
                populate: "fullname"
            },
        })
        res.status(200).json({
            success: true,
            message:"Payroll the period retrieved",
            payroll
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({success:false, error:"fetch Payroll server Error"})
    }
}
export { getAllNSITFList, getAllPensionList,getITFByEmployee, getITFByPeriod, getNSITFByPeriod,
    getNSITFByEmployee, getPAYEByEmployee, getPAYEByPeriod, getPensionByEmployee,getPensionByPeriod,
    getAllITFList, getAllPAYEList

}