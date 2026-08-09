import express from 'express'
import authMiddleware from "../middleware/authMiddleware.js"

import { addbeneficiaries, addPermSalarModifiers, editPermanentSalaryModifiers, getAllPayrollBank, getallPayrollByDepartment, getallPayrollByGrade, getAllPayrollList, getAllPayrollPerPeriod, getPayrollActivities, getPayrollByEmployee, getPayrollForEmployee, getPermanentSalaryModifiers, getTempoarySalaryModifiers, syncPayrollsForPeriod, upsertPayroll } from '../Controllers/payrollContollers.js'
import { getAllAppraisals } from '../Controllers/AppraisalController.js'
const router = express.Router()


router.put('/payroll/sync', syncPayrollsForPeriod)
router.get('/payroll/departments', getallPayrollByDepartment)
router.get('/payroll/permanent', getPermanentSalaryModifiers)
router.get('/payroll/temporary/:employeeId', getTempoarySalaryModifiers)
router.get('/payroll/grade', getallPayrollByGrade)
router.get('/payroll/bank', getAllPayrollBank)
router.post('/payroll/department', getallPayrollByDepartment)
router.post('/payroll/period', getAllPayrollPerPeriod)
router.get('/payroll/list', getAllPayrollList) 
router.post('/payroll/permenent', addPermSalarModifiers)
router.get('/payroll/activities', getPayrollActivities)
router.post('/payroll/beneficiary', addbeneficiaries)
router.put('/payroll/permanent/edit/:id', editPermanentSalaryModifiers)
router.post('/payrolls/employee', getPayrollForEmployee)
router.get('/payroll/permament/:id', getPermanentSalaryModifiers)
router.put('/:id/payroll', upsertPayroll)
router.get('/payroll/:id', getPayrollByEmployee)




export default router

