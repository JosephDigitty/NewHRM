import express from "express"
import { createAppraisalCycle, editAppraisalPeriod, getAllAppraisals, getAppraisalPeriod, getAppraisalPeriods, getKpiGoal, getKpiGoals, getsupervisorKpis, setKpiGoals, submitSelfScores, supervisorScoreKpis} from "../Controllers/AppraisalController.js"


const router = express.Router()
router.get('/', getAllAppraisals)
router.post("/create-cycle", createAppraisalCycle)
router.get("/appraisals", getAppraisalPeriods)
router.get("/appraisals/:id", getAppraisalPeriod)
router.put("/update-cycle/:id", editAppraisalPeriod)
router.post("/asign-kpi", setKpiGoals)
router.post("/employeeKpis", getKpiGoals)
router.get("/employeeKpis/:id", getKpiGoal)
router.post("/selfappraisal/:id", submitSelfScores)
router.post("/supervisorKpis/", getsupervisorKpis)
router.post("/supervisorappraisal/:id", supervisorScoreKpis)

export default router


