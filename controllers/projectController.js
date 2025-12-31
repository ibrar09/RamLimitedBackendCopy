// src/controllers/projectController.js
import * as projectService from "../services/projectService.js";
import { translateText } from "../utils/translator.js"; // 🔹 import translation utility
import slugify from "slugify";

/**
 * 🟢 Get all projects
 */
export const getAllProjectsController = async (req, res) => {
  try {
    console.log("📥 [GET] Fetching all projects");
    const projects = await projectService.getAllProjects();
    console.log("✅ [GET] Projects fetched:", projects.length);
    res.status(200).json(projects);
  } catch (error) {
    console.error("❌ [GET] Error fetching projects:", error);
    res.status(500).json({ error: "Failed to fetch projects", details: error.message });
  }
};

/**
 * 🟢 Get project by ID
 */
export const getProjectByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("📥 [GET] Fetching project with ID:", id);
    const project = await projectService.getProjectById(id);

    if (!project) {
      console.warn("⚠️ Project not found:", id);
      return res.status(404).json({ message: "Project not found" });
    }

    console.log("✅ [GET] Project fetched successfully:", project.id);
    res.status(200).json(project);
  } catch (error) {
    console.error("❌ [GET] Error fetching project by ID:", error);
    res.status(500).json({ error: "Failed to fetch project", details: error.message });
  }
};

/**
 * 🟢 Create a new project (with multiple file uploads)
 */
export const createProjectController = async (req, res) => {
  try {
    console.log("📥 [POST] Incoming create project request");
    console.log("➡️ req.body:", req.body);
    console.log("🖼️ req.files:", req.files);

    // Handle main image
    const mainImagePath = req.files?.image?.[0]
      ? `/uploads/${req.files.image[0].filename}`
      : null;

    // Handle testimonial image
    const testimonialImagePath = req.files?.testimonialImage?.[0]
      ? `/uploads/${req.files.testimonialImage[0].filename}`
      : null;

    // Handle gallery images
    const galleryImagesPaths = req.files?.images
      ? req.files.images.map((file) => `/uploads/${file.filename}`)
      : [];

    // Build project data
    const data = {
      ...req.body,
      image: mainImagePath,
      testimonial: JSON.parse(req.body.testimonial || "{}"),
      challengeSolution: JSON.parse(req.body.challengeSolution || "[]"),
      investment: JSON.parse(req.body.investment || "{}"),
    };

    // Override testimonial image path
    if (testimonialImagePath) {
      data.testimonial.image = testimonialImagePath;
    }

    // 🔹 Auto-translate fields to Arabic
    data.name_ar = await translateText(data.name, "ar");
    data.category_ar = await translateText(data.category, "ar");
    data.client_ar = await translateText(data.client, "ar");
    data.description_ar = await translateText(data.description, "ar");

    // 🔹 Generate slug from project name
    data.slug = slugify(data.name, { lower: true, strict: true });

    // Save project
    const project = await projectService.createProject(data);

    // Save gallery images to project_images table
    if (galleryImagesPaths.length > 0) {
      await projectService.addProjectImages(project.id, galleryImagesPaths);
    }

    console.log("✅ [POST] Project created successfully:", project.id);

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: project,
    });
  } catch (error) {
    console.error("❌ [POST] Error creating project:", error);
    res.status(400).json({
      success: false,
      message: "Failed to create project",
      details: error.message,
    });
  }
};

/**
 * 🟢 Update existing project (with file upload)
 */
export const updateProjectController = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("📥 [PUT] Incoming update for project ID:", id);
    console.log("➡️ req.body:", req.body);
    console.log("🖼️ req.files:", req.files);

    const image = req.files?.image?.[0]
      ? `/uploads/${req.files.image[0].filename}`
      : req.body.image || null;

    const images = req.files?.images
      ? req.files.images.map((file) => `/uploads/${file.filename}`)
      : req.body.images || [];

    const testimonialImage = req.files?.testimonialImage?.[0]
      ? `/uploads/${req.files.testimonialImage[0].filename}`
      : req.body.testimonialImage || null;

    const data = { ...req.body, id, image, images, testimonialImage };

    // 🔹 Auto-translate fields to Arabic if they exist in body
    if (data.name) data.name_ar = await translateText(data.name, "ar");
    if (data.category) data.category_ar = await translateText(data.category, "ar");
    if (data.client) data.client_ar = await translateText(data.client, "ar");
    if (data.description) data.description_ar = await translateText(data.description, "ar");

    const updatedProject = await projectService.updateProject(data);

    // Ensure the response has a unique `id` for MUI Data Grid
    const responseData = {
      id: updatedProject.id, // <-- REQUIRED for Data Grid
      name: updatedProject.name,
      category: updatedProject.category,
      client: updatedProject.client,
      year: updatedProject.year,
      duration: updatedProject.duration,
      budget: updatedProject.budget,
      featured: updatedProject.featured,
      teamSize: updatedProject.team_size,
      image: updatedProject.image,
      images: updatedProject.images || [],
      testimonial: updatedProject.testimonials?.[0] || {},
      challengeSolution: [
        ...(updatedProject.challenges || []),
        ...(updatedProject.solutions || [])
      ],
      investment: updatedProject.investment || {},
    };

    res.status(200).json({
      message: "Project updated successfully",
      project: responseData,
    });
  } catch (error) {
    console.error("❌ [PUT] Error updating project:", error);
    res.status(500).json({
      message: "Failed to update project",
      error: error.message,
    });
  }
};

/**
 * 🟢 Delete project by ID
 */
export const deleteProjectController = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("📥 [DELETE] Incoming delete request for project ID:", id);

    const deleted = await projectService.deleteProject(id);

    if (!deleted) {
      console.warn("⚠️ [DELETE] Project not found:", id);
      return res.status(404).json({ message: "Project not found" });
    }

    console.log("✅ [DELETE] Project deleted successfully:", id);
    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("❌ [DELETE] Error deleting project:", error);
    res.status(500).json({ error: "Failed to delete project", details: error.message });
  }
};
export const getProjectBySlugController = async (req, res) => {
  try {
    const { slug } = req.params;

    const project = await projectService.getProjectBySlug(slug);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json(project);
  } catch (error) {
    console.error("[getProjectBySlugController ERROR]", error);
    res.status(500).json({ message: "Server error" });
  }
};
