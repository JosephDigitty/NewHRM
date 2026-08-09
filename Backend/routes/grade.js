import express from 'express'
import authMiddleware from "../middleware/authMiddleware.js"

import { addGrade, getGrades } from '../Controllers/gradeControllers.js'
const router = express.Router()

router.post('/add', addGrade)
router.get('/', getGrades)



export default router