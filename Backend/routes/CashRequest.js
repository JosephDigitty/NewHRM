import express from 'express'
import { createCashRequisition } from '../Controllers/CashRquestController.js';
import { upload } from '../db/Cloudinary.js';
const router = express.Router()

router.post(
  "/",
  upload.array("supportingDocuments", 5),
  createCashRequisition
);

export default router