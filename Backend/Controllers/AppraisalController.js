
import AppraisalCycle from "../model/AppraisalSchema/ApraisalCycle.js"
import Appraisal from "../model/AppraisalSchema/KPI.js"
import User from "../model/user.js"
import Employee from "../model/Employee.js"

const createAppraisalCycle = async (req, res) => {
    //Tested and completed
    try {
      const {cycleName, startDate, endDate, userId} = req.body  
      const user = await User.findById(userId)
      if (user.role !== "admin"){
        return res.status(400).json({success:false, message:"only admin can create appraisal cycle"})
      }
      if(!cycleName || !startDate || !endDate){
        return res.status(400).json({success:false, message:"All field must be filed"})
      }
      const startingDate = new Date(startDate)
      const endingDate = new Date(endDate)
      const appraisalCycle = new AppraisalCycle({
        cycleName,
        startDate: startingDate,
        endDate: endingDate, 
        status:"open"
      })

      await appraisalCycle.save()
      res.status(201).json({success: true, message:"Create New Apprisal Cycle sucesfully",})
    } catch (error) {
        res.status(500).json({success:false, error: "Appraisal Created Server Error"})
    }
}

const getAppraisalPeriods = async (req, res) => {
  //TESTED AND COMPLETED
  try {
     const appraisalCycle = await AppraisalCycle.find()
     .sort({createdAt: -1})
     res.status(200).json({success: true, message:"Operation successful", appraisalCycle})
  } catch (error) {
    res.status(500).json({success:false, error: "Appraisal Created Server Error"})
  }
}
const getAppraisalPeriod = async (req, res) => {
  //TESTED AND COMPLETED
    try {
      const id = req.params.id
      const appraisalCycle = await AppraisalCycle.findById(id)
      res.status(200).json({success: true, message:"Operation successful", appraisalCycle})
      
    } catch (error) {
      res.status(500).json({success:false, error: "Appraisal Created Server Error"})
    }
}
const editAppraisalPeriod = async (req, res) => {
  //TESTED AND COMPLETED
    try {
      const id = req.params.id
      const {cycleName, startDate, endDate, status} = req.body
      const updatedCycle = await AppraisalCycle.findOneAndUpdate({_id:id}, {cycleName, startDate, endDate, status})
      res.status(200).json({success: true, message:"Operation successful", updatedCycle})
      
    } catch (error) {
      res.status(500).json({success:false, error: "Appraisal Created Server Error"})
      console.log(error)
    }
}

const setKpiGoals = async (req, res) => {
  //TESTED AND WORKING FINE
  try {
    console.log("payload recieved", req.body)
    const {employeeId, supervisorId, appraisalCycleId, kpis } = req.body
     const existing = await Appraisal.findOne({
      employee:employeeId,
      cycle:appraisalCycleId
    })
    
    const cycle = await AppraisalCycle.findById(appraisalCycleId)
    if (cycle.status === "closed") {
      return res.status(400).json({
        message: "Appraisal Cycle is not Open to set Kpi",
        success:false
      })
    }
    if (existing) {
      return res.status(400).json({
        message: "Appraisal already exists for this cycle"
      })
    }
     const totalWeight = kpis.reduce((sum, kpi) => sum + Number(kpi.weight),0)

    if (totalWeight !== 100) {
      return res.status(400).json({
        message: "Total KPI weight must equal 100%"
      })
    }
    const KpiGoals = new Appraisal({
      supervisor:supervisorId,
      employee:employeeId,
      cycle:appraisalCycleId,
      kpis:kpis,
      totalScore:0,
      rating:0
    }) 
    await KpiGoals.save()
    res.status(200).json({success:true, message:"Kpi goals added successfully"})
  } catch (error) {
    res.status(500).json({success:false, error: "Appraisal Created Server Error"})
  }
}

const getKpiGoals = async (req, res) => {
  //TESTED AND WOERKING FINE
  console.log("Payload recieved", req.body)
  try {
  const {employeeId} = req.body
  const appraisals = await Appraisal.find({employee: employeeId})
  .populate({
    path: "supervisor",
    populate: {
      path: "userId",
      model: "User"
    }
  })
  .populate("cycle")
  .populate({ path: "employee", model: "User" })
  .sort({ createdAt: -1 })
  res.status(200).json({success: true, message:"Operation successful", appraisals})
  } catch (error) {
    res.status(500).json({success:false, error: "Error Fetching Kpi Goals"})
  }
}

const getKpiGoal = async (req, res) => {
  //TESTED AND WORKING FINE
  try {
  const {id} = req.params
  const appraisals = await Appraisal.findById(id)
  .populate({
    path: "supervisor",
    populate: {
      path: "userId",
      model: "User"
    }
  }).populate({
    path: "employee",
    populate: {
      path: "userId",
      model: "User"
    }
  })
  .populate("cycle")
  res.status(200).json({success: true, message:"Operation successful", appraisals})
  } catch (error) {
    res.status(500).json({success:false, error: "Error Fetching Kpi Goals"})
  }
}

const getsupervisorKpis = async (req, res) => {
  //TESTED AND WOERKING FINE
  try {
    console.log("Payload Recieved", req.body)
  const {supervisorId} = req.body
  const supervisorEmployee = await Employee.findOne({ userId: supervisorId })
  if (!supervisorEmployee) {
      return res.status(404).json({ success: false, message: "Supervisor not found" });
    }
  const appraisals = await Appraisal.find({ supervisor: supervisorEmployee._id })
  .populate({
    path: "employee",
    populate: {
      path: "userId",
      model: "User"
    }
  })
  .populate("cycle")
  .populate({ path: "employee", model: "User" })
  if(!appraisals){
     res.status(200).json({success: true, message:"You dont have any pending review", appraisals:[]})
  }
  res.status(200).json({success: true, message:"Operation successful", appraisals})
  } catch (error) {
    res.status(500).json({success:false, error: "Error Fetching Kpi Goals"})
    console.log(error)
  }
}

const supervisorScoreKpis = async (req, res) => {
  try {
    const { scores, overallFeedback, appraisalId } = req.body;

    const appraisal = await Appraisal.findById(appraisalId);
    if (!appraisal) {
      return res.status(404).json({ success: false, message: "Appraisal not found" });
    }

    const cycle = await AppraisalCycle.findById(appraisal.cycle);
    if (cycle.status === "closed") {
      return res.status(400).json({
        message: "Appraisal Cycle is not Open for appraisal",
        success: false
      });
    }

    // Update KPI scores
    scores.forEach(score => {
      const kpi = appraisal.kpis.id(score.kpiId);
      if (kpi) {
        kpi.supervisorScore = score.supervisorScore;
        kpi.supervisorComment = score.supervisorComment;
      }
    });

    // Calculate Averages
    const employeeAvg = appraisal.kpis.reduce((sum, kpi) => sum + (kpi.selfScore || 0), 0) / appraisal.kpis.length;
    const supervisorAvg = appraisal.kpis.reduce((sum, kpi) => sum + (kpi.supervisorScore || 0), 0) / appraisal.kpis.length;
    const finalNumericScore = Number(((employeeAvg + supervisorAvg) / 2).toFixed(1));

    // --- RATING LOGIC START ---
    const getRatingLabel = (score) => {
      if (score >= 4.5) return "Outstanding";
      if (score >= 3.5) return "Excellent";
      if (score >= 2.5) return "Good";
      if (score >= 1.5) return "Unsatisfactory";
      return "Bad";
    };

    appraisal.totalScore = finalNumericScore;
    appraisal.rating = getRatingLabel(finalNumericScore); // Save the string label
    // --- RATING LOGIC END ---

    appraisal.overallFinalComment = overallFeedback;
    appraisal.status = "Appraised";

    await appraisal.save();

    res.status(200).json({
      success: true,
      message: "Supervisor scores submitted",
      totalScore: finalNumericScore,
      rating: appraisal.rating,
      appraisal
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const submitSelfScores = async (req, res) => {
  //TESTED AND WORKING FINE
  try {
    console.log("payload recieved", req.body)

    const {appraisalId, scores, actualAchievement}  = req.body
    /*
    expected body

    {
      scores: [
        {
          kpiId: "kpiObjectId",
          selfScore: 4,
          selfComment: "Completed all assigned tasks"
        }
      ]
    }

    but the score will be stored in the result array of the appraisal schema
    */

    const appraisal = await Appraisal.findById(appraisalId)
    if (!appraisal) {
      return res.status(404).json({
        success: false,
        message: "Appraisal not found",
      });
    }
    
    const appraisalCycleId = await appraisal.cycle
    const cycle = await AppraisalCycle.findById(appraisalCycleId)
    if (!cycle) {
      return res.status(404).json({
        success: false,
        message: "Appraisal cycle not found",
      });
    }

  if (cycle.status === "closed") {
      return res.status(400).json({
        success: false,
        message: "Appraisal Cycle is not Open for appraisal",
      });
    }

    scores.forEach(score => {

      const kpi = appraisal.kpis.id(score.kpiId)

      if (kpi) {
        kpi.selfScore = score.selfScore
        kpi.selfComment = score.selfComment
        kpi.actualAchievement = score.actualAchievement
      }

    })

    appraisal.status = "Awaiting supervisor review"

    await appraisal.save()
 
    res.status(201).json({
      success:true,
      message: "Self scores submitted successfully",
      appraisal
    })

  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: error.message, 
    })
  }
}

const getAllAppraisals = async (req, res) => {
  try {
    const appraisal = await Appraisal.find()
    .populate({
    path: "employee",
    populate: {
      path: "userId",
      model: "User"
    }
  })
  .populate("cycle")
  .populate({ path: "employee", model: "User" })
  .populate("supervisor")

    res.status(200).json({
      success: true,
      message: "fetch appraisal successfully",
      appraisal
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: error.message, 
    })
  } 
}


export {createAppraisalCycle, getAppraisalPeriod, getAppraisalPeriods, getsupervisorKpis,
    setKpiGoals, supervisorScoreKpis, submitSelfScores , editAppraisalPeriod, getKpiGoals, getKpiGoal, getAllAppraisals
}