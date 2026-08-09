import express from 'express'
import authMiddleware from "../middleware/authMiddleware.js"

import { updateSalaryModifiers } from '../Controllers/salaryModifiersContollers.js'
const router = express.Router()

router.put('/:id/payroll', updateSalaryModifiers)



export default router