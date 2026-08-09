import express from 'express'
import { login, verify } from '../Controllers/authController.js'
import authMiddleware from '../middleware/authMiddleware.js'
import { loginValidation } from '../Config/Validator.js'
import { allowOnly } from '../Config/AllowOnly.js'


const router = express.Router() 

router.post('/login', 
    allowOnly(["email", "password"]),
    loginValidation, 
    login )
router.get('/verify', authMiddleware, verify )

export default router 