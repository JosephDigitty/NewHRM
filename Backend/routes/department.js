import express from 'express'
import authMiddleware from "../middleware/authMiddleware.js"
import {addDepartment , deleteDepartment, editDepartment, getAllDepartments, getDepartment} from '../Controllers/departmentController.js'
const router = express.Router()

router.get('/', getAllDepartments)
router.post('/add', addDepartment)
router.get('/:id', getDepartment)
router.put('/:id', editDepartment)
router.delete('/:id', deleteDepartment)


export default router