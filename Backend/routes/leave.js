import express from 'express'

import { approveLeave, getAllLeave, getEmployeeLeaveBalances, getEmployeeLeaveRequests, getLeave, getLeaveTypes, leaveApply, rejectLeave } from '../Controllers/leaveController.js'
const router = express.Router()

router.get('/leaveType', getLeaveTypes)
router.post('/add-leave', leaveApply)
router.get('/leave-request', getAllLeave)
router.post('/leavedetails/:id', getLeave)
router.post('/reject/:id', rejectLeave)
router.post('/approve/:id', approveLeave)
router.get('/employeebalance/:id', getEmployeeLeaveBalances)
router.post('/employee',getEmployeeLeaveRequests);



export default router