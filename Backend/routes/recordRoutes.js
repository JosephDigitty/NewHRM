import express from 'express'
import { createNewRecords, getallRecords } from '../Controllers/recordController.js'
import { upload } from '../db/Cloudinary.js'

const router = express.Router()

router.post("/employee-records/:id",
    upload.single("document"),
    createNewRecords
)
router.get("/record/:id", getallRecords)

export default router