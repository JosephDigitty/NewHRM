import Payroll from "../model/Payroll.js"
import PAYEE from "../model/PAYE.js"
import Pension from "../model/Pension.js"
import ITF from "../model/ITF.js"
import NSITF from "../model/NSITF.js"
import HmoDeductions from "../model/HmoDeductions.js"
import Employee from "../model/Employee.js"

const upsertPayroll =  async (req, res) => {
    try {
        console.log("payload recieve", req.body)
        const {id: employeeId, allowances, deductions, period} = req.body
        //To Determine the period name
        const [year, month] = period.split("-")
        const date = new Date(`${year}-${month}-01`)
        const monthName = date.toLocaleString("default", { month: "short" })
        const pensionPeriodName = `${monthName} ${year} Pension`
        const payeePeriodName = `${monthName} ${year} PAYE`
        const payrollperiodName = `${monthName} ${year} Payroll`
        const ITFperiodName = `${monthName} ${year} ITF`
        const NSITFperiodName = `${monthName} ${year} NSITF`
        const thisMonth = new Date().toISOString().slice(0,7)
        const sentMonth = new Date(period + "-01")
        const inThisMonth = new Date(thisMonth + "-01")
        // if (sentMonth > inThisMonth) {
        //      return res.status(400).json({success:false, error: "Cant modify payroll of future month"})
        // }
        if(!period && !employeeId) {
            return res.status(400).json({success:false, error: "Employee Id and Padate is required"})
        }
        const employee = await Employee.findById(employeeId).populate("job.grade").populate("hmo")
        if(!employee){
             return res.status(404).json({success:false, error: "Employee not found"})
        }
        const basicSalary = employee.job.grade.basicSalary
        const housingAllowance= employee.job.grade.housingAllowance || 0
        const wardrobeAllowance = employee.job.grade.wardrobeAllowance || 0
        const transportAllowance = employee.job.grade.transportAllowance || 0
        const medicalAllowance = employee.job.grade.medicalAllowance || 0

        const totalRecurringAllowance = housingAllowance + wardrobeAllowance + transportAllowance + medicalAllowance

        const permAllowances = employee.salaryModifiers.allowances
        const permDeductions = employee.salaryModifiers.deductions
        const beneficiary = employee.beneficiary || []
        const hmo = employee.hmo?.amount || 1
        const hmoAmount = beneficiary.length * hmo
        let totalPermAllownaces = 0 
        for(let i = 0; i < permAllowances.length; i++) {
            totalPermAllownaces += permAllowances[i].amount || 0
        }

        let totalPermDeductions = 0 
        for(let i = 0; i < permDeductions.length; i++) {
            totalPermDeductions += permDeductions[i].amount || 0
        }     
        let totalOneTimeAllowances = 0;
        for (let i = 0; i < allowances.length; i++) {
            totalOneTimeAllowances += allowances[i].amount || 0;
        }

        let totalOneTimeDeduction = 0;
        for (let i = 0; i < deductions.length; i++) {
            totalOneTimeDeduction += deductions[i].amount || 0;
        }
        // Paye & Pension Computaion 
        // step 1 - Calculate Gross Pay 
        const grossPay = basicSalary + totalRecurringAllowance
        const annualGrossPay = grossPay * 12
        const pensionPay = basicSalary + housingAllowance + transportAllowance
        const pensionPerMonth = pensionPay * 0.08
        const annualPension = pensionPerMonth * 12
        const pensionGross = annualGrossPay - annualPension
        const CRA = Math.max(200000, 0.01 * pensionGross) + (0.20 * pensionGross);
        const taxRelief = CRA + annualPension;
        const taxableIncome = annualGrossPay - taxRelief
        //computation of ITFs
        const ITFamount = grossPay * 0.01
        //computation of PAYE
        let remaining = taxableIncome;
        let PAYE = 0;
        if (remaining > 0) {
        const band1 = Math.min(300000, remaining);
        PAYE += band1 * 0.07;
        remaining -= band1;
        }
        if (remaining > 0) {
        const band2 = Math.min(300000, remaining);
        PAYE += band2 * 0.11;
        remaining -= band2;
        }

        if (remaining > 0) {
        const band3 = Math.min(500000, remaining);
        PAYE += band3 * 0.15;
        remaining -= band3;
        }

        if (remaining > 0) {
        const band4 = Math.min(500000, remaining);
        PAYE += band4 * 0.19;
        remaining -= band4;
        }

        if (remaining > 0) {
        const band5 = Math.min(1600000, remaining);
        PAYE += band5 * 0.21;
        remaining -= band5;
        }

        if (remaining > 0) {
        PAYE += remaining * 0.24;
        }

        const minimumTax = 0.01 * pensionGross;
        PAYE = Math.max(PAYE, minimumTax);
        const monthlyPAYE = PAYE / 12;

        const totalEarnings = basicSalary + totalRecurringAllowance + totalOneTimeAllowances + totalPermAllownaces
        const totalDeductions = totalOneTimeDeduction + totalPermDeductions 
        const netSalary = totalEarnings - totalDeductions - monthlyPAYE - pensionPerMonth - hmoAmount

        let payroll = await Payroll.findOne({ employeeId, period });

        if (!payroll) {
             payroll = new Payroll({
                employeeId,
                period,
                basicSalary,
                housingAllowance,
                wardrobeAllowance,
                transportAllowance,
                medicalAllowance,
                permAllowances,
                permDeductions,
                oneTimeallowances: allowances,
                oneTimedeductions: deductions,
                totalEarnings,
                totalDeductions,
                netSalary,
                payrollperiodName,
                monthlyPAYE,
                pensionPerMonth
            });
           
        } 
        if (payroll && payroll.status === "Draft" || "Finanlized"){
            payroll.period = period;
            payroll.payDate = period;
            payroll.basicSalary = basicSalary;
            payroll.housingAllowance = housingAllowance;
            payroll.wardrobeAllowance = wardrobeAllowance;
            payroll.transportAllowance = transportAllowance;
            payroll.medicalAllowance = medicalAllowance;
            payroll.permAllowances = permAllowances;
            payroll.permDeductions = permDeductions;
            payroll.oneTimeAllowances = allowances;
            payroll.oneTimeDeductions = deductions;
            payroll.totalEarnings = totalEarnings;
            payroll.totalDeductions = totalDeductions;
            payroll.netSalary = netSalary;
            payroll.payrollperiodName = payrollperiodName;
            payroll.monthlyPAYE = monthlyPAYE;
            payroll.pensionPerMonth = pensionPerMonth;
            
        } else {
            return res.status(500).json({success:true, error: "Payroll for this employee cannot be modified"})
        }
        await payroll.save();

         let payee = await PAYEE.findOne({ employeeId, period });
            if(!payee) {
                payee = new PAYEE({
                    employeeId,
                    payrollId: payroll._id,
                    period,
                    name: payeePeriodName,
                    amount: monthlyPAYE
                    })
                } 
                await payee.save()
        let HMO = await HmoDeductions.findOne({ employeeId, period });
            if(!HMO) {
                HMO = new HmoDeductions({
                    employeeId,
                    payrollId: payroll._id,
                    period,
                    name: payeePeriodName,
                    amount: hmoAmount
                    })
                } 
                await HMO.save()

                let pension = await Pension.findOne({ employeeId, period });

                if(!pension) {
                pension = new Pension({
                    employeeId,
                    payrollId: payroll._id,
                    period,
                    name: pensionPeriodName,
                    amount: pensionPerMonth
                    })
                } 
                await pension.save()

        let ITFs = await ITF.findOne({employeeId, period})

        if(!ITFs) {
            ITFs = new ITF({
                employeeId,
                payrollId: payroll._id,
                period,
                name: ITFperiodName,
                amount: ITFamount
            })
        }

        await ITFs.save()

         let NSITFs = await NSITF.findOne({employeeId, period})

        if(!NSITFs) {
            NSITFs = new NSITF({
                employeeId,
                payrollId: payroll._id,
                period,
                name: ITFperiodName,
                amount: ITFamount
            })
        }

        await NSITFs.save()

        return res.status(200).json({ success: true, payroll });
    } catch (error) {
        console.error("Error adding Payroll:", error);
        return res.status(500).json({ success: false, error: "Error adding Payroll" });
    }
}
const syncPayrollsForPeriod = async (req, res) => {
    try {
        console.log("Payload recieved", req.body)
        const { payDate } = req.body;
       
        
        const [year, month] = payDate.split("-")
        const date = new Date(`${year}-${month}-01`)
        const monthName = date.toLocaleString("default", { month: "short" })
        const payeePeriodName = `${monthName} ${year} PAYE`
        const pensionPeriodName =  `${monthName} ${year} Pension`
        const ITFperiodName = `${monthName} ${year} ITF`
        const NSITFperiodName = `${monthName} ${year} NSITF`
        const payrollperiodName = `${monthName} ${year} Payroll`
        if (!payDate) {
            return res.status(400).json({ success: false, error: "Period (YYYY-MM) is required" });
        }

        const employees = await Employee.find().populate("job.grade").populate("hmo");
        const updatedPayrolls = [];
        
        const beneficiary = employees.beneficiary || []
        const hmo = employees.hmo?.amount || 0
        const hmoAmount = beneficiary.length * hmo
        for (let i = 0; i < employees.length; i++) {
            const employee = employees[i];
            const employeeId = employee._id;
            let currentPayroll
            const existingPayroll = await Payroll.findOne({
                employeeId: employee._id,
                payDate
            });

            // Salary & recurring from grade
            const basicSalary = employee.job.grade.basicSalary || 0;
            const housingAllowance = employee.job.grade.housingAllowance || 0;
            const wardrobeAllowance = employee.job.grade.wardrobeAllowance || 0;
            const transportAllowance = employee.job.grade.transportAllowance || 0;
            const medicalAllowance = employee.job.grade.medicalAllowance || 0;

            const totalRecurringAllowance =
                housingAllowance + wardrobeAllowance + transportAllowance + medicalAllowance;

            // Permanent modifiers
            const permAllowances = employee.salaryModifiers?.allowances || [];
            const permDeductions = employee.salaryModifiers?.deductions || [];

            const totalPermAllowances = permAllowances.reduce((sum, a) => sum + (a.amount || 0), 0);
            const totalPermDeductions = permDeductions.reduce((sum, d) => sum + (d.amount || 0), 0);

                // Paye & Pension Computaion 
            // step 1 - Calculate Gross Pay 
            const grossPay = basicSalary + totalRecurringAllowance
            const annualGrossPay = grossPay * 12
            const pensionPay = basicSalary + housingAllowance + transportAllowance
            const pensionPerMonth = pensionPay * 0.08
            const annualPension = pensionPerMonth * 12
            const pensionGross = annualGrossPay - annualPension
            const CRA = Math.max(200000, 0.01 * pensionGross) + (0.20 * pensionGross);
            const taxRelief = CRA + annualPension;

            const taxableIncome = annualGrossPay - taxRelief
            //computation of ITFs
            const ITFamount = grossPay * 0.01
            //computation of PAY
            let remaining = taxableIncome;
            let PAYE = 0;

            if (remaining > 0) {
            const band1 = Math.min(300000, remaining);
            PAYE += band1 * 0.07;
            remaining -= band1;
            }

            if (remaining > 0) {
            const band2 = Math.min(300000, remaining);
            PAYE += band2 * 0.11;
            remaining -= band2;
            }

            if (remaining > 0) {
            const band3 = Math.min(500000, remaining);
            PAYE += band3 * 0.15;
            remaining -= band3;
            }

            if (remaining > 0) {
            const band4 = Math.min(500000, remaining);
            PAYE += band4 * 0.19;
            remaining -= band4;
            }

            if (remaining > 0) {
            const band5 = Math.min(1600000, remaining);
            PAYE += band5 * 0.21;
            remaining -= band5;
            }

            if (remaining > 0) {
            PAYE += remaining * 0.24;
            }

            const minimumTax = 0.01 * pensionGross;
            PAYE = Math.max(PAYE, minimumTax);
            const monthlyPAYE = PAYE / 12;
                    
            if (!existingPayroll) {
                // CREATE payroll (one-time arrays empty)
                const totalEarnings = basicSalary + totalRecurringAllowance + totalPermAllowances;
                const totalDeductions = totalPermDeductions;
                const netSalary = totalEarnings - totalDeductions - monthlyPAYE - pensionPerMonth - hmoAmount
                
                const payroll = new Payroll({
                    employeeId: employee._id,
                    period: payDate,
                    basicSalary,
                    housingAllowance,
                    wardrobeAllowance,
                    transportAllowance,
                    medicalAllowance,
                    permAllowances,
                    permDeductions,
                    oneTimeAllowances: [],
                    oneTimeDeductions: [],
                    totalEarnings,
                    totalDeductions,
                    netSalary,
                    status: "Draft",
                    payrollperiodName,
                    monthlyPAYE,
                    pensionPerMonth,
                    payDate
                });

                await payroll.save();
                updatedPayrolls.push(payroll);
                currentPayroll = payroll
            } else {
                // UPDATE payroll (only permanent stuff)
                const totalEarnings =
                    existingPayroll.basicSalary +
                    existingPayroll.housingAllowance +
                    existingPayroll.wardrobeAllowance +
                    existingPayroll.transportAllowance +
                    existingPayroll.medicalAllowance +
                    totalPermAllowances +
                    (existingPayroll.oneTimeAllowances?.reduce((sum, a) => sum + (a.amount || 0), 0) || 0);

                const totalDeductions =
                    totalPermDeductions +
                    (existingPayroll.oneTimeDeductions?.reduce((sum, d) => sum + (d.amount || 0), 0) || 0);

                existingPayroll.permAllowances = permAllowances;
                existingPayroll.permDeductions = permDeductions;
                existingPayroll.totalEarnings = totalEarnings;
                existingPayroll.totalDeductions = totalDeductions;
                existingPayroll.netSalary = totalEarnings - totalDeductions;
                
                await existingPayroll.save();
                updatedPayrolls.push(existingPayroll);
                currentPayroll = existingPayroll
            }
                
            let payee = await PAYEE.findOne({ employeeId, period:payDate });
             if(!payee) {
                payee = new PAYEE({
                    employeeId,
                    payrollId: currentPayroll._id,
                    period:payDate,
                    name: payeePeriodName,
                    amount: monthlyPAYE
                    })
                } 
                await payee.save()

                let pension = await Pension.findOne({ employeeId, period:payDate });

                if(!pension) {
                pension = new Pension({
                    employeeId,
                    payrollId: currentPayroll._id,
                    period:payDate,
                    name: pensionPeriodName,
                    amount: pensionPerMonth
                    })
                } 
                await pension.save()

                        let ITFs = await ITF.findOne({employeeId, period:payDate})

                if(!ITFs) {
                    ITFs = new ITF({
                        employeeId,
                        payrollId: currentPayroll._id,
                        period:payDate,
                        name: ITFperiodName,
                        amount: ITFamount
                    })
                }

                await ITFs.save()
                 let HMO = await HmoDeductions.findOne({ employeeId, period:payDate });
                if(!HMO) {
                HMO = new HmoDeductions({
                    employeeId,
                    payrollId: currentPayroll._id,
                    period:payDate,
                    name: payeePeriodName,
                    amount: hmoAmount
                    })
                } 
                await HMO.save()

                let NSITFs = await NSITF.findOne({employeeId, period:payDate })

                if(!NSITFs) {
                    NSITFs = new NSITF({
                        employeeId,
                        payrollId: currentPayroll._id,
                        period:payDate,
                        name: NSITFperiodName,
                        amount: ITFamount
                    })
                }

                await NSITFs.save()
        }
        return res.status(200).json({
            success: true,
            message: "Payrolls synced successfully for period " + payDate,
            payrolls: updatedPayrolls
        });
    } catch (error) {
        console.error("Error syncing payrolls:", error);
        return res.status(500).json({ success: false, error: "Server error syncing payrolls" });
    }
};

const getallPayrollByDepartment = async (req, res) => {
    try {

        const {payDate, department} = req.body
        const period = new Date(payDate).toISOString().slice(0, 7)

        if(!payDate) {
            return res.status(400).json({success:false, error: "Paydate is required"})
        }
        if(!department) {
            return res.status(400).json({success:false, error: "Department is required"})
        }

        const payrolls = await Payroll.find({period})
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
                select: "fullname"
                }
            ]
        })    
        let filteredPayrollByDepartment = []

        for (let i = 0; i < payrolls.length; i++) {
            if (payrolls[i].employeeId?.job?.department?._id.toString() === department) {
                filteredPayrollByDepartment.push(payrolls[i])
            }filteredPayrollByDepartment
        }

        if(!filteredPayrollByDepartment) {
            return res.status(404).json({success:false, error: "Payroll is not found"})
        }
        
       
        res.status(200).json({success: true, 
            filteredPayrollByDepartment, 
            message: "successfully fetch successfully" })
    } catch (error) {
        console.log(error)
        res.status(500).json({success:false, error:"fetch Payroll server Error"}) 
    }
}

const getAllPayrollPerPeriod = async (req, res) => {
    try {
        console.log("payload recieved",req.body)
        const {payDate} = req.body
    
        if(!payDate) {
            return res.status(400).json({success:false, error: "Paydate is required"})
        }
        const period = payDate
        const payrolls = await Payroll.find({period})
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
                select: "fullname"
                }
            ]
        })    
        
        res.status(200).json({success: true, 
            payrolls,
            message: "successfully fetch successfully" })
    } catch (error) {
        console.log(error)
        res.status(500).json({success:false, error:"fetch Payroll server Error"}) 
    }
}
const getallPayrollByGrade = async (req , res) => {
    try {

        const {payDate, grade} = req.body
        const period = new Date(payDate).toISOString().slice(0, 7)

        if(!payDate) {
            return res.status(400).json({success:false, error: "Paydate is required"})
        }
        if(!grade) {
            return res.status(400).json({success:false, error: "Department is required"})
        }

        const payrolls = await Payroll.find({period}).populate({
            path: "employeeId",
            populate: {
                path: "job.grade",
                select: 'gradeName'
            },
            populate: {
                path: "userId",
                select: 'fullname'
            }, 
            populate: {
               path: "job.department",
               select:"department_Name" 
            }
        })    

        let filteredPayrollByGrade = []

        for (i = 0; i < payrolls.length; i++) {
            if (payrolls[i].employeeId.grade.grade_id.toString() === department) {
                filteredPayrollByGrade.push(payrolls[i])
            }
        }

        if(!filteredPayrollByGrade) {
            return res.status(404).json({success:false, error: "Payroll is not found"})
        }
        
        
        res.status(200).json({success: true, filteredPayrollByGrade})
    } catch (error) {
        console.log(error)
        res.status(500).json({success:false, error:"fetch Payroll server Error"}) 
    }
}

// const getAllPayrollPerPeriod = async () => {
//     try {
//         const {payDate, department, grade} = req.body
//         const period = new Date(payDate).toISOString().slice(0, 7)

//         const payrolls = await Payroll.find({period}).populate({
//             path: "employeeId",
//             populate: {
//                 path: "job.department",
//                 select: 'department_Name'
//             },
//             populate: {
//                 path: "job.grade",
//                 select: 'gradeName'
//             },
//             populate: {
//                 path: "userId",
//                 select: 'fullname'
//             }
//         })

//         let filteredPayroll = []

//         for (i = 0; i < payrolls.length; i++) {
//             const emp = payrolls[i].employeeId
//             if(emp.department.department_id.toString() === department && emp.grade.grade_id.toString() === grade) {
//                 filteredPayroll.push(payrolls[i])
//             }
//         }
//         if (!filteredPayroll) {
//             return res.status(404).json({success:false, error: "Payroll is not found"})
//         }
//         res.status(200).json({success: true, filteredPayroll})
//         } catch (error) {
//         console.log(error)
//         res.status(500).json({success:false, error:"fetch Payroll server Error"})
//     }
// }

const getPayrollByPeriod = async (req, res) => {
    try {
        const {paydate} = req.body
        const period = paydate.slice(0,7)
        const payroll = Payroll.findOne({period}).populate({
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

const getPayrollByEmployee = async (req, res) => {
    try {
        const userId = req.params.id;

        // Step 1: Find employee linked to this user
        const employee = await Employee.findOne({ userId });

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee not found for this user"
            });
        }
        const payroll = await Payroll.find({ employeeId: employee._id })
            .populate({
                path: "employeeId",
                populate: [
                    { path: "job.department", populate: "department_Name" },
                    { path: "job.grade", populate: "gradeName" },
                    { path: "userId", select: "fullname" }
                ]
            });

        return res.status(200).json({
            success: true,
            message: "Payroll retrieved successfully",
            payroll
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            error: "fetch Payroll server Error"
        });
    }
};

const getPayrollForEmployee = async (req, res) => {
    console.log("payload recieved", req.body)
    try {
        const {employeeId} = req.body;

        // Step 1: Find employee linked to this user
         const employee = await Employee.findOne({ userId: employeeId })

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee not found for this user"
            });
        }
        const payroll = await Payroll.find({ employeeId: employee._id })
            .populate({
                path: "employeeId",
                populate: [
                    { path: "job.department", populate: "department_Name" },
                    { path: "job.grade", populate: "gradeName" },
                    { path: "userId", select: "fullname" }
                ]
            });

        return res.status(200).json({
            success: true,
            message: "Payroll retrieved successfully",
            payroll
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            error: "fetch Payroll server Error"
        });
    }
};

const getAllPayrollList = async (req, res) => {
    try {
        const payroll = await Payroll.find()
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
                select: "fullname"
                }
            ]
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

const getAllPayrollBank = async (req, res) => {
    try {
        const payroll = await Payroll.find()
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
                }
            ]
        })
        .sort({ period: -1 })
        .limit(1)
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

const getPermanentSalaryModifiers = async (req, res) => {
    try {
        const id = req.params.id
        const employee = await Employee.findById(id)
        if (!employee) {
           return res.status(404).json({success: false, error: "employee is not found"})
        }
        const {allowances, deductions} = employee.salaryModifiers
        res.status(200).json({success: true, message: "Update Salary Modifiers True", allowances, deductions})
    } catch {
        res.status(500).json({success: false, error: "Server Error"})
        console.log(error)
    }
}

const editPermanentSalaryModifiers = async (req, res) => {
    try {
        console.log("Payload recieved", req.body)
        const {id, allowances, deductions} = req.body

    const employee = await Employee.findById(id)
    employee.salaryModifiers.allowances = allowances
    employee.salaryModifiers.deductions = deductions
    await employee.save()
    res.status(200).json({success: true, message: "Permanent Salary Modifiers has been updated", employee})
    } catch (error) {
        res.status(500).json({success: false, error: "Server Error"})
        console.log(error)
    }

}
const addPermSalarModifiers = async (req, res) => {
    try {
        console.log("payload recieve", req.body)
        const {id: employeeId, allowances, deductions} = req.body
        if(!employeeId) {
            return res.status(400).json({success:false, error:"Employee Id is required"})
        }
        let employee = await Employee.findById(employeeId) 
        if (!employee) {
            return res.status(404).json({success:false, error: "Employee is not found"})
        } 
            employee.salaryModifiers.allowances = allowances,
            employee.salaryModifiers.deductions = deductions
        await employee.save()
        res.status(200).json({success:true, message:"Pemanent salary modification has been added to this employee"})
    } catch (error) {
        res.status(500).json({success:false, error:"modifiying salary server error"})
        console.log(error)
    }

}

const addbeneficiaries = async (req, res) => {
    try {
        const {id: employeeId, beneficiary} = req.body
        if(!employeeId) {
            return res.status(400).json({success:false, error:"Employee Id is required"})
        }
        let employee = await Employee.findById(employeeId) 
        if (!employee) {
            return res.status(404).json({success:false, error: "Employee is not found"})
        } 
            employee.beneficiary = beneficiary,
        await employee.save()
        res.status(200).json({success:true, message:"Employee Beneficiaries has been added"})
    } catch (error) {
        res.status(500).json({success:false, error:"Add Beneficiary Server Error"})
        console.log(error)
    }

}
const getTempoarySalaryModifiers = async (req, res) => {
    try {
        
        const { employeeId } = req.params;
        const payroll = await Payroll.findOne({employeeId}).sort({ period: -1 })
        if (!payroll) {
           return res.status(404).json({success: false, error: "payroll not found"})
        }
        const {oneTimeAllowances: allowances = [], oneTimeDeductions: deductions = []} = payroll
        res.status(200).json({success: true, data : {allowances, deductions}})
    } catch (error) {
        console.error("Error fetching temporary salary modifiers:", error);
        console.log(error)
    }
}


const editTempoarySalaryModifiers = async (req, res) => {
    try {
        const {employeeId, allowances, deductions} = req.body
        const payroll = await Payroll.findOne({employeeId})
        if (!payroll) {
            return res.status(404).json({ success: false, error: "Payroll not found" });
        }
        payroll.oneTimeAllowances = allowances
        payroll.oneTimeDeductions = deductions
        await payroll.save()
        res.status(200).json({success: true, message: "Temporary Salary Modifiers has been updated"})
    } catch (error) {
        res.status(500).json({success: false, error: "Server Error"})
        console.log(error)
    }
}

const getPayrollActivities = async (req, res) => {
  try {
    const { year = new Date().getFullYear() } = req.query
    const payrolls = await Payroll.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`)
          }
        }
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          payrollName: { $last: "$name" },
          totalAmount: { $sum: "$totalAmount" },
          employeeCount: { $sum: "$employeeCount" },
          status: { $last: "$status" },
          date: { $last: "$createdAt" }
        }
      },
      { $sort: { "_id": -1 } } // latest month first
    ])

    res.status(200).json({ success: true, payrolls })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export  {
    upsertPayroll, addPermSalarModifiers, getallPayrollByDepartment, 
    getallPayrollByGrade, getAllPayrollPerPeriod, editPermanentSalaryModifiers,
    getPermanentSalaryModifiers, getTempoarySalaryModifiers, editTempoarySalaryModifiers, syncPayrollsForPeriod,
    getPayrollByPeriod, getAllPayrollList, getPayrollByEmployee, getAllPayrollBank , addbeneficiaries, getPayrollForEmployee,
    getPayrollActivities
} 

