

import express from 'express'
import authMiddleware from "../middleware/authMiddleware.js"
import {addEmployee, getAllEmployee, getEmployee, editEmployee, getEmployeesByDepartment, resetEmployeePassword} from '../Controllers/employeeContollers.js'
import { upload } from '../db/Cloudinary.js';
const router = express.Router()

router.post(
  "/add",
  upload.fields([
    { name: "offerLetter", maxCount: 1 },
    { name: "resume", maxCount: 1 },
    { name: "nationalId", maxCount: 1 },
    { name: "passport", maxCount: 1 },
  ]),
  addEmployee
);

router.get('/', getAllEmployee)
router.get('/department/:id', getEmployeesByDepartment)
router.post('/reset/:id', resetEmployeePassword)
router.get('/:id', getEmployee)
router.put('/:id', editEmployee)

// router.delete('/:id', deleteDepartment)
// router.post('/add', upload.single('image'), addEmployee)


export default router