import express from "express";
import {
  createNewRecords,
  getEmployeeRecords,
  getSingleRecord,
} from "../Controllers/recordController.js";
import { upload } from "../db/Cloudinary.js"; // Adjust import path if needed

const router = express.Router();

// Route to create a new record (handles multipart file upload via multer)
router.post("/employee-records/:id", upload.array("documents", 10), createNewRecords);

// Route to get ALL records for a specific employee
router.get("/employee-records/:id", getEmployeeRecords);

// Route to get a SINGLE record by its recordId
router.get("/record/:recordId", getSingleRecord);

export default router;