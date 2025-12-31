import multer from "multer";
import path from "path";
import fs from "fs";

// ✅ Base upload folder
const baseUploadDir = "./uploads";

// Ensure base folder exists
if (!fs.existsSync(baseUploadDir)) {
  fs.mkdirSync(baseUploadDir, { recursive: true });
}

// ------------------ GENERIC STORAGE ------------------ //
const genericStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, baseUploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

// ------------------ PROJECT STORAGE ------------------ //
const projectStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const projectDir = path.join(baseUploadDir, "projects");
    if (!fs.existsSync(projectDir)) {
      fs.mkdirSync(projectDir, { recursive: true });
    }
    cb(null, projectDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

// ------------------ CV STORAGE ------------------ //
const cvStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const cvDir = path.join(baseUploadDir, "cvs");
    if (!fs.existsSync(cvDir)) {
      fs.mkdirSync(cvDir, { recursive: true });
    }
    cb(null, cvDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

// ------------------ IMAGE FILE FILTER ------------------ //
const imageFileFilter = (req, file, cb) => {
  console.log("Received file:", file.originalname, "type:", file.mimetype);
  const allowedMimes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
  if (allowedMimes.includes(file.mimetype)) cb(null, true);
  else cb(new Error(`Invalid file type. Only JPEG, PNG, WEBP, GIF allowed.`));
};

// ------------------ CV FILE FILTER ------------------ //
const cvFileFilter = (req, file, cb) => {
  console.log("Received CV:", file.originalname, "type:", file.mimetype);
  const allowedMimes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  if (allowedMimes.includes(file.mimetype)) cb(null, true);
  else cb(new Error(`Invalid file type. Only PDF, DOC, DOCX allowed.`));
};

// ------------------ EXPORT UPLOADS ------------------ //

// Generic upload (images, etc.)
export const upload = multer({
  storage: genericStorage,
  fileFilter: imageFileFilter,
  limits: { files: 5, fileSize: 10 * 1024 * 1024 }, // 10 MB each
});

// Project upload (multiple images, testimonial)
export const projectUpload = multer({
  storage: projectStorage,
  fileFilter: imageFileFilter,
  limits: { files: 10, fileSize: 10 * 1024 * 1024 }, // 10 MB each
}).fields([
  { name: "image", maxCount: 1 },
  { name: "images", maxCount: 10 },
  { name: "testimonialImage", maxCount: 1 },
]);

// CV upload
export const cvUpload = multer({
  storage: cvStorage,
  fileFilter: cvFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
});
