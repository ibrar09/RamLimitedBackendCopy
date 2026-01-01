// routes/jobRoutes.js
import express from "express";
import {
    createJob,
    getAllJobs,
    getAllJobsAdmin,
    getJobById,
    updateJob,
    deleteJob,
} from "../controllers/jobController.js";
// import { verifyToken, isAdmin } from "../middleware/authMiddleware.js"; // Uncomment when auth is ready or if needed

const router = express.Router();

// Public Routes
router.get("/", getAllJobs);
router.get("/:id", getJobById);

// Admin Routes (Protect these in production)
// For now leaving open or you should add verifyToken/isAdmin if available
router.get("/admin/all", getAllJobsAdmin);
router.post("/", createJob);
router.put("/:id", updateJob);
router.delete("/:id", deleteJob);

export default router;
