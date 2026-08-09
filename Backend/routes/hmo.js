import express from 'express'
import authMiddleware from "../middleware/authMiddleware.js"
import { createHmo, editHmo, getHmo, getHmoSingular } from '../Controllers/HMOController.js'


const router = express.Router()

router.get('/', getHmo)
router.post('/add', createHmo )
router.put("/edit/:id", editHmo)
router.get('/hmo/:id', getHmoSingular )



export default router