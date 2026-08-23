import Employee from "../model/Employee.js"
import User from "../model/user.js"
import bcrypt from "bcrypt"
import Department from "../model/Department.js"
import { generatePassword } from "../db/GeneratePassword.js"
import { uploadToCloudinary } from "../db/CloudinaryUtils.js"
import { sendWelcomeEmail } from "../db/NodeMailer.js"


const addEmployee = async (req, res) => {
  try {
    const { personal, job } = req.body;

    const personalData = typeof personal === "string" ? JSON.parse(personal) : personal;
    const jobData = typeof job === "string" ? JSON.parse(job) : job;

    const { fullname, email, authorisation, dob } = personalData;
    const { role, department } = jobData;

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ success: false, error: "User already exists" });
    }

    const uploadIfExists = async (fieldName, folder) => {
      const file = req.files?.[fieldName]?.[0];
      if (!file) return null;
      const result = await uploadToCloudinary(file.buffer, folder);
      return result.secure_url;
    };

    const documents = {
      offerLetter: await uploadIfExists("offerLetter", "employees/offer-letters"),
      resume: await uploadIfExists("resume", "employees/resumes"),
      nationalId: await uploadIfExists("nationalId", "employees/national-ids"),
      passport: await uploadIfExists("passport", "employees/passports"),
    };

    const employeeId = fullname.slice(0, 3).toUpperCase() + Date.now();

    const plainPassword = generatePassword(
      process.env.COMPANY_NAME || "COMP",
      fullname,
      department,
      dob
    );
    const hashPassword = await bcrypt.hash(plainPassword, 10);

    const newUser = new User({
      fullname,
      email,
      password: hashPassword,
      role,
      profileImage: documents.passport,
      authorisation,
    });

    await newUser.save();
    
    const employee = new Employee({
      employeeId,
      personal: personalData,
      job: jobData,
      documents,
      userId: newUser._id,
    });

    await employee.save();

    try {
      await sendWelcomeEmail({
        to: email,
        fullname,
        email,
        password: plainPassword,
      });
    } catch (emailError) {
      console.log("Welcome email failed to send:", emailError.message);
      // don't return/throw — employee + user already saved successfully
    }

    return res.status(201).json({
      success: true,
      messages: "Employee added successfully",
      employee,
      temporaryPassword: plainPassword,
    });
    
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, error: "add employee server error" });
  }
};


const getAllEmployee =  async (req, res) => {
    try{
        const employees = await Employee.find()
        .populate("userId", { password: 0 })
        .populate("job.department")
        .populate("job.grade");
       res.status(200).json({success: true, employees})
    }catch(error) {
        console.log(error)
        return res.status(500).json({success: false, error: "fetch employee server error"})
    }
}

const getEmployee = async (req, res) => {
    try {
        const id = req.params.id
        let employee;
        employee = await Employee.findById(id).
        populate("userId", {password: 0}).
        populate("job.department").
        populate("job.grade")
        if (!employee) {
           employee = await Employee.findOne({ userId: id}).
            populate("userId", {password: 0}).
            populate("job.department").
            populate("job.grade")
        }
        res.status(200).json({success: true, employee})
    } catch (error) {
        console.error("Error fetching department:", error);
        res.status(500).json({success:false, error: "fetch employee server error"})
    }
}

const editEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({ success: false, error: "Employee not found" });
    }
    if (req.body.userId) {
      const user = await User.findById(req.body.userId);
      if (!user) {
        return res.status(404).json({ success: false, error: "User not found" });
      }
    }
    const updateEmployee = await Employee.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json({
      success: true,
      message: "Employee updated successfully",
      employee: updateEmployee,
    });

  } catch (error) {
    console.error("Error Editing Employee:", error);
    res.status(500).json({ success: false, error: "Edit Employee server error" });
  }
};

 const getEmployeesByDepartment = async (req, res) => {
    try {
        const id = req.params.id
    
        const employees = await Employee.find({department: id}).populate("userId", "name")
          
        res.status(200).json({success: true, employees})
    } catch (error) {
        console.error("Error fetching employee by Id:", error);
        res.status(500).json({success:false, error: "fetch employee server error"})
    }
 }

export {addEmployee, getAllEmployee, getEmployee, editEmployee, getEmployeesByDepartment} 
