import multer from "multer"
import Employee from "../model/Employee.js"
import User from "../model/user.js"
import bcrypt from "bcrypt"
import path from "path"
import Department from "../model/Department.js"

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

const addEmployee = async (req, res) => {
   try{
    const { personal, job } = req.body;
    const documents = {
      offerLetter: req.files?.offerLetter?.[0]?.filename || null,
      resume: req.files?.resume?.[0]?.filename || null,
      nationalId: req.files?.nationalId?.[0]?.filename || null,
      passport: req.files?.passport?.[0]?.filename || null,
    };
   const personalData = typeof personal === "string" ? JSON.parse(personal) : personal
   const jobData = typeof req.body.job === "string" ? JSON.parse(job) : job;
    const {fullname , email, password } = personalData
    const {role} = jobData
    const employeeId = fullname.slice(0,3) + Date.now()
    const user = await User.findOne({email})
    if(user) {
        return res.status(400).json({success: false, error: "User already exists"})
    }
    //then add the password
    const hashPassword = await bcrypt.hash(password, 10)
    const newUser = new User({
        fullname: fullname, 
        email: email,
        password: hashPassword,
        role,
        profileImage: documents.passport
    })

     await newUser.save()

    const employee = new Employee({
      employeeId,
      personal: personalData,
      job: jobData,
      documents,
      userId: newUser._id,
    });
        await employee.save() ;
       
    return res.status(201).json({success: true, messages: "Employee added successfully", employee: employee})
   } catch (error) {
        console.log(error.message)
        

       return res.status(500).json({success: false, error: "add employee server error"})
   }

}

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

export {addEmployee, upload, getAllEmployee, getEmployee, editEmployee, getEmployeesByDepartment} 
