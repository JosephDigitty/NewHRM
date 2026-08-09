import express from 'express'
import authMiddleware from "../middleware/authMiddleware.js"
import { addTask, deleteTask, getTasks, toggleTask } from '../Controllers/Todo.js'

const router = express.Router()

router.get("/", getTasks)         
router.post("/add", addTask)       
router.put("/:id", toggleTask)     
router.delete("/:id", deleteTask)  

export default router