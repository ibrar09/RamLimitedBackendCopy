import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

let cloudinaryConfigured = false;

// Option 1: Use CLOUDINARY_URL (easiest - single variable)
if (process.env.CLOUDINARY_URL) {
    cloudinary.config({
        cloudinary_url: process.env.CLOUDINARY_URL,
    });
    cloudinaryConfigured = true;
    console.log("✅ [Cloudinary] Configured with CLOUDINARY_URL");
}
// Option 2: Use individual credentials
else if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    cloudinaryConfigured = true;
    console.log("✅ [Cloudinary] Configured with individual credentials");
} else {
    console.log("⚠️ [Cloudinary] Not configured. Using local storage fallback.");
}

export { cloudinary, cloudinaryConfigured };
