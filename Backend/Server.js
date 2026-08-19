import express from "express";
import cors from "cors";
import { configDotenv } from "dotenv";
import connectToDatabase from "./db/db.js";
import { userRegister } from "./userSeed.js";
import router from "./routes/auth.js";
import departmentRouter from "./routes/department.js";
import EmployeeRouter from "./routes/employeeRoutes.js";
import LeaveRouter from "./routes/leave.js";
import GradeRouter from "./routes/grade.js";
import payrollRouter from "./routes/payroll.js";
import hmoRouter from "./routes/hmo.js";
import statutoryRouter from "./routes/statutory.js";
import appraisalRouter from "./routes/appraisal.js";
import todoRouter from "./routes/Todo.js";
import verifyUser from "./middleware/authMiddleware.js";
import path from "path";
import seedLeaveTypes from "./leaveSeed.js";
import seedLeaveBalances from "./leaveBalanceSeed.js";
import resetLeaveBalancesForNewYear from "./resetLeaveBalanceForNew.js";

configDotenv();
const app = express();
app.use(
  cors({
    origin: "http://localhost:5173", // Frontend URL
    methods: "GET,POST,PUT,DELETE",
    credentials: true, // if you're using cookies or authentication
  })
);
app.use(express.json());
app.use("/api/auth", router);
app.use("/api/department", departmentRouter);
app.use("/api/employee", EmployeeRouter);
app.use("/api/leave", LeaveRouter);
app.use("/api/grade", GradeRouter);
app.use("/api/employee", payrollRouter);
app.use("/api/employee", statutoryRouter);
app.use("/api/hmo", hmoRouter);
app.use("/api/appraisal", appraisalRouter);
app.use("/api/todo", todoRouter);
app.use(
  "/uploads",
  express.static(path.join(path.resolve(), "public/uploads"))
);
const currentYear = new Date().getFullYear();

const startServer = async () => {
  try {
    await connectToDatabase();
    await Promise.all([
    userRegister(),
    seedLeaveTypes(),
    seedLeaveBalances(),
    resetLeaveBalancesForNewYear(currentYear)
    ]);
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  } catch (error) {
    process.exit(1);
  }
};
startServer();
