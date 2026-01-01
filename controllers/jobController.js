// controllers/jobController.js
import { Job, CV } from "../models/index.js";
import { Op } from "sequelize";

/* ---------------- CREATE JOB (Admin) ---------------- */
export const createJob = async (req, res) => {
    try {
        const { title, description, location, type, requirements, status } = req.body;

        const job = await Job.create({
            title,
            description,
            location,
            type,
            requirements,
            status: status || "active",
        });

        return res.status(201).json({ success: true, data: job });
    } catch (err) {
        console.error("createJob error:", err);
        return res.status(500).json({ success: false, message: err.message });
    }
};

/* ---------------- GET ALL JOBS (Public - Active Only) ---------------- */
export const getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.findAll({
            where: { status: "active" },
            order: [["created_at", "DESC"]],
        });
        return res.json({ success: true, data: jobs });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

/* ---------------- GET ALL JOBS (Admin - All) ---------------- */
export const getAllJobsAdmin = async (req, res) => {
    try {
        const jobs = await Job.findAll({
            order: [["created_at", "DESC"]],
            include: [
                { model: CV, as: "applications", attributes: ["id"] } // Count applications easily
            ]
        });
        return res.json({ success: true, data: jobs });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

/* ---------------- GET JOB BY ID ---------------- */
export const getJobById = async (req, res) => {
    try {
        const job = await Job.findByPk(req.params.id);
        if (!job) return res.status(404).json({ success: false, message: "Job not found" });
        return res.json({ success: true, data: job });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

/* ---------------- UPDATE JOB (Admin) ---------------- */
export const updateJob = async (req, res) => {
    try {
        const job = await Job.findByPk(req.params.id);
        if (!job) return res.status(404).json({ success: false, message: "Job not found" });

        await job.update(req.body);
        return res.json({ success: true, data: job });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

/* ---------------- DELETE JOB (Admin) ---------------- */
export const deleteJob = async (req, res) => {
    try {
        const job = await Job.findByPk(req.params.id);
        if (!job) return res.status(404).json({ success: false, message: "Job not found" });

        await job.destroy();
        return res.json({ success: true, message: "Job deleted successfully" });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
