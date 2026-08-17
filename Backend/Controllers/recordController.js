import { resolve } from "path";
import { getCloudinary } from "../db/Cloudinary.js"
import records from "../model/RecordSchemas.js"
import User from "../model/user.js"
import Employee from "../model/Employee.js"


const createNewRecords = async (req, res) => {
  try {
    console.log("Payload received:", req.body);
    const { id } = req.params;
    const {
      title,
      description,
      date,
      type,
      status,
      location,
      actionTaken,
      employeeResponse,
      userid
    } = req.body;

    // 1. Guard against invalid/missing Employee ID
    if (!id || id === "undefined") {
      return res.status(400).json({ success: false, error: "Invalid Employee ID provided." });
    }

    // 2. Validate Admin User
    if (!userid) {
      return res.status(400).json({ success: false, error: "User ID is required for authorization." });
    }

    const user = await User.findById(userid);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ success: false, error: "Unauthorized engagement" });
    }

    // 3. Find Employee & validate
    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({
        success: false,
        error: `Employee with ID ${id} not found`,
      });
    }

    // 4. Safely extract initials from associated user account
    let initials = "EMP";
    if (employee.userId) {
      const employeeUserDetail = await User.findById(employee.userId);
      if (employeeUserDetail?.fullname) {
        initials = employeeUserDetail.fullname
          .trim()
          .split(' ')
          .filter(Boolean)
          .map(name => name[0].toUpperCase())
          .join('');
      }
    }

    // 5. Generate formatted Case ID
    const now = date ? new Date(date) : new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const formattedCode = `${initials}-${year}-${month}`;

    // 6. Handle Cloudinary File Upload via Buffer Stream
    let documentUrl = "";
    let documentPublicId = "";

    if (req.file) {
        const cloudinaryClient = getCloudinary()
      const uploadResult = await new Promise((resolveUpload, rejectUpload) => {
        const stream = cloudinaryClient.uploader.upload_stream(
          {
            folder: "employee-records",
            resource_type: "auto"
          },
          (error, result) => {
            if (error) rejectUpload(error);
            else resolveUpload(result);
          }
        );
        stream.end(req.file.buffer);
      });

      documentUrl = uploadResult.secure_url;
      documentPublicId = uploadResult.public_id;
    }

    // 7. Instantiate and save record
    const newRecord = new records({
      employeeid: id,
      title,
      description,
      Date: date,
      type,
      status: status || "Open",
      caseId: formattedCode, // <--- Assigned generated code
      location,
      actionTaken: actionTaken || "",
      employeeResponse: employeeResponse || "",
      document: documentUrl,
      documentPublicId: documentPublicId
    });

    await newRecord.save();

    return res.status(201).json({
      success: true,
      message: "Record created successfully",
      data: newRecord
    });

  } catch (error) {
    console.error("Error creating record:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

const getallRecords = async (req, res) => {
   try {
    const { id } = req.params
    if (!id || id === "undefined") {
      return res.status(400).json({
        success: false,
        error: "Valid Employee ID is required",
      });
    }
    const employeeRecords = await records
      .find({ employeeid: id })
      .sort({ createdAt: -1 });

      return res.status(200).json({
      success: true,
      count: employeeRecords.length,
      data: employeeRecords,
    });
   } catch (error) {
    console.error("Error fetching employee records:", error);
    return res.status(500).json({ success: false, error: error.message });
   }
}

const getRecords = (req, res) => {
     try {
        const { recordId } = req.params

     } catch (error) {
        
     }
}

const  editRecords = (req, res) => {

}

const responseRecord = (req, res) => {

}

export {createNewRecords, getRecords, getallRecords, editRecords, responseRecord}


