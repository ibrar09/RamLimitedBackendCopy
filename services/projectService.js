import fs from "fs";
import * as db from "../models/index.js";

const {
  Project,
  ProjectImage,
  ProjectChallenge,
  ProjectSolution,
  ProjectTestimonial,
  ProjectInvestment,
  InvestmentFeature,
} = db;

// Helper: save uploaded files and return paths
export const handleFiles = (files) => {
  const images = [];
  if (!files) return images;

  for (const key in files) {
    files[key].forEach((file) => {
      images.push("/uploads/" + file.filename);
    });
  }

  return images;
};

// Helper: safely parse JSON
export const safeParse = (value, fallback = null) => {
  try {
    if (!value) return fallback;
    if (typeof value === "string") return JSON.parse(value);
    return value;
  } catch (err) {
    console.error("⚠️ JSON parse failed for value:", value);
    return fallback;
  }
};

// ✅ Add project gallery images
export const addProjectImages = async (projectId, imagePaths) => {
  const records = imagePaths.map((path) => ({
    project_id: projectId,
    image_url: path,
  }));
  return await ProjectImage.bulkCreate(records);
};

// Create a project
export const createProject = async (data, files = null) => {
  console.log("🟢 [createProject] Incoming data:", data);

  const challengeSolution = safeParse(data.challengeSolution, []);
  const testimonial = safeParse(data.testimonial, null);
  const investment = safeParse(data.investment, null);

  const projectData = { ...data };
  const uploadedImages = handleFiles(files);
  if (uploadedImages.length > 0) projectData.image = uploadedImages[0];

  const galleryImages = uploadedImages.slice(1);

  const project = await Project.create(projectData);

  // Add gallery images
  if (galleryImages.length) {
    await addProjectImages(project.id, galleryImages);
  }

  // Challenges / solutions
  const challenges = [];
  const solutions = [];
  challengeSolution.forEach((cs) => {
    const obj = {
      project_id: project.id,
      title: cs.title,
      content: cs.content,
      icon: cs.icon,
      icon_bg_color: cs.iconBgColor,
      icon_text_color: cs.iconTextColor,
    };
    if (cs.type === "challenge") challenges.push(obj);
    else if (cs.type === "solution") solutions.push(obj);
  });
  if (challenges.length) await ProjectChallenge.bulkCreate(challenges);
  if (solutions.length) await ProjectSolution.bulkCreate(solutions);

  // Testimonial
  if (testimonial) {
    await ProjectTestimonial.create({
      project_id: project.id,
      ...testimonial,
    });
  }

  // Investment + features
  if (investment) {
    const { features = [], ...investmentData } = investment;
    const inv = await ProjectInvestment.create({
      project_id: project.id,
      ...investmentData,
    });

    if (features.length) {
      await InvestmentFeature.bulkCreate(
        features.map((f) => ({ investment_id: inv.id, feature: f }))
      );
    }
  }

  return getProjectById(project.id);
};

// Get project by ID
export const getProjectById = async (id) => {
  return await Project.findByPk(id, {
    include: [
      { model: ProjectImage, as: "images" },
      { model: ProjectChallenge, as: "challenges" },
      { model: ProjectSolution, as: "solutions" },
      { model: ProjectTestimonial, as: "testimonials" },
      {
        model: ProjectInvestment,
        as: "investment",
        include: [{ model: InvestmentFeature, as: "features" }],
      },
    ],
  });
};

// Get all projects
export const getAllProjects = async () => {
  return await Project.findAll({
    include: [
      { model: ProjectImage, as: "images" },
      { model: ProjectChallenge, as: "challenges" },
      { model: ProjectSolution, as: "solutions" },
      { model: ProjectTestimonial, as: "testimonials" },
      {
        model: ProjectInvestment,
        as: "investment",
        include: [{ model: InvestmentFeature, as: "features" }],
      },
    ],
    order: [["id", "ASC"]],
  });
};

// Update project
export const updateProject = async (data) => {
  const { id, image, images, testimonialImage, testimonial, challengeSolution, investment, ...rest } = data;

  // 1️⃣ Update main project fields
  await Project.update(
    { ...rest, image },
    { where: { id } }
  );

  // 2️⃣ Update gallery images
  if (images && images.length) {
    // Remove old images
    await ProjectImage.destroy({ where: { project_id: id } });
    // Add new images
    await ProjectImage.bulkCreate(
      images.map((img) => ({
        project_id: id,
        image_url: img,
      }))
    );
  }

  // 3️⃣ Update testimonial
  if (testimonial) {
    // Replace existing testimonial
    await ProjectTestimonial.destroy({ where: { project_id: id } });
    await ProjectTestimonial.create({
      project_id: id,
      ...testimonial,
      image: testimonialImage || testimonial?.image || null,
    });
  }

  // 4️⃣ Update challenges & solutions
  if (challengeSolution && challengeSolution.length) {
    // Remove old entries
    await ProjectChallenge.destroy({ where: { project_id: id } });
    await ProjectSolution.destroy({ where: { project_id: id } });

    const challenges = [];
    const solutions = [];
    challengeSolution.forEach((cs) => {
      const obj = {
        project_id: id,
        title: cs.title,
        content: cs.content,
        icon: cs.icon,
        icon_bg_color: cs.iconBgColor,
        icon_text_color: cs.iconTextColor,
      };
      if (cs.type === "challenge") challenges.push(obj);
      else if (cs.type === "solution") solutions.push(obj);
    });

    if (challenges.length) await ProjectChallenge.bulkCreate(challenges);
    if (solutions.length) await ProjectSolution.bulkCreate(solutions);
  }

  // 5️⃣ Update investment + features
  if (investment) {
    const { features = [], ...invData } = investment;

    // Remove old investment and features
    await ProjectInvestment.destroy({ where: { project_id: id } });

    const inv = await ProjectInvestment.create({
      project_id: id,
      ...invData,
    });

    if (features.length) {
      await InvestmentFeature.bulkCreate(
        features.map((f) => ({ investment_id: inv.id, feature: f }))
      );
    }
  }

  // 6️⃣ Return updated project with related data
  return getProjectById(id);
};
// Delete project
export const deleteProject = async (id) => {
  const project = await Project.findByPk(id);
  if (!project) throw new Error("Project not found");

  await Project.destroy({ where: { id } });
  return { message: "Project deleted successfully" };
};

export const getProjectBySlug = async (slug) => {
  return await Project.findOne({
    where: { slug },
    include: [
      { model: ProjectImage, as: "images" },
      { model: ProjectChallenge, as: "challenges" },
      { model: ProjectSolution, as: "solutions" },
      { model: ProjectTestimonial, as: "testimonials" },
      {
        model: ProjectInvestment,
        as: "investment",
        include: [
          { model: InvestmentFeature, as: "features" },
        ],
      },
    ],
  });
};