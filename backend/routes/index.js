import express from "express";
import authRoute from "./authRoutes.js";
import userRoute from "./userRoutes.js";
import jobsRoute from "./jobRoutes.js";
import adminRoute from "./adminRoutes.js";
const router = express.Router();

router.use(`/auth`, authRoute); //auth/register
router.use(`/users`, userRoute);
router.use(`/jobs`, jobsRoute);
router.use(`/admin`, adminRoute);
export default router;
