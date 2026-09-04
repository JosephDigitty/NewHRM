import express from 'express'
import { getLatestBatch } from "../Controllers/BatchPayroll.js"
import { submitPayrollForReview } from '../Controllers/BatchPayroll.js'
import { acceptPayroll } from '../Controllers/BatchPayroll.js'

const router = express.Router()


router.get('/latest-batch', getLatestBatch)
router.post('/payroll/batches/submit',submitPayrollForReview)
router.post('/payroll/batches/accept',acceptPayroll)

export default router

