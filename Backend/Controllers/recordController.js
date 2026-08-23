import { getCloudinary } from "../db/Cloudinary.js";
import Employee from "../model/Employee.js";
import records from "../model/RecordSchema.js";
import User from "../model/user.js";

// 1. CREATE NEW RECORD
export const createNewRecords = async (req, res) => {
  try {
    console.log("Payload received:", req.body);
    console.log("req.files:", req.files)
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
      userid,
    } = req.body;

    // Guard against invalid/missing Employee ID
    if (!id || id === "undefined") {
      return res.status(400).json({ success: false, error: "Invalid Employee ID provided." });
    }

    // Validate Admin User
    if (!userid) {
      return res.status(400).json({ success: false, error: "User ID is required for authorization." });
    }

    const user = await User.findById(userid);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ success: false, error: "Unauthorized engagement" });
    }

    // Find Employee & validate
    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({
        success: false,
        error: `Employee with ID ${id} not found`,
      });
    }

    // Safely extract initials from associated user account
    let initials = "EMP";
    if (employee.userId) {
      const employeeUserDetail = await User.findById(employee.userId);
      if (employeeUserDetail?.fullname) {
        initials = employeeUserDetail.fullname
          .trim()
          .split(" ")
          .filter(Boolean)
          .map((name) => name[0].toUpperCase())
          .join("");
      }
    }

    // Generate formatted Case ID
    const now = date ? new Date(date) : new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const formattedCode = `${initials}-${year}-${month}`;

    // Handle multiple file uploads to Cloudinary
    let documents = [];

    if (req.files && req.files.length > 0) {
      const cloudinaryClient = getCloudinary();

      const uploadPromises = req.files.map((file) => {
        return new Promise((resolveUpload, rejectUpload) => {
          const stream = cloudinaryClient.uploader.upload_stream(
            {
              folder: "employee-records",
              resource_type: "auto",
            },
            (error, result) => {
              if (error) return rejectUpload(error);
              resolveUpload({
                url: result.secure_url,
                publicId: result.public_id,
                name: file.originalname,
                size: file.size,
              });
            }
          );
          stream.end(file.buffer);
        });
      });

      documents = await Promise.all(uploadPromises);
    }


    // Instantiate and save record
    const newRecord = new records({
      employeeid: id,
      title,
      description,
      Date: date,
      type,
      status: status || "Open",
      caseID: formattedCode,
      location,
      actionTaken: actionTaken || "",
      employeeResponse: employeeResponse || "",
      documents: documents,
    });

    await newRecord.save();

    return res.status(201).json({
      success: true,
      message: "Record created successfully",
      data: newRecord,
    });
  } catch (error) {
    console.error("Error creating record:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

// 2. GET ALL RECORDS FOR A SPECIFIC EMPLOYEE
export const getEmployeeRecords = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || id === "undefined") {
      return res.status(400).json({ success: false, error: "Valid Employee ID is required" });
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
};

// 3. GET A SINGLE RECORD
export const getSingleRecord = async (req, res) => {
  try {
    const { recordId } = req.params;

    if (!recordId || recordId === "undefined") {
      return res.status(400).json({ success: false, error: "Valid Record ID is required" });
    }

    const record = await records.findById(recordId);

    if (!record) {
      return res.status(404).json({ success: false, error: "Record not found" });
    }

    return res.status(200).json({
      success: true,
      data: record,
    });
  } catch (error) {
    console.error("Error fetching record:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};