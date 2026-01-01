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
    const urlParts = process.env.CLOUDINARY_URL.split(':');
    // Basic heuristic: keys are usually numeric. If the Key part (after // and before :) contains letters, it might be swaped.
    // url format: cloudinary://key:secret@cloud_name
    // part[1] ends with //, part[2] is key
    // This is a naive regex check.

    console.log("✅ [Cloudinary] Configured with CLOUDINARY_URL");
    const matches = process.env.CLOUDINARY_URL.match(/cloudinary:\/\/([^:]+):/);
    if (matches && matches[1] && /[a-zA-Z]/.test(matches[1])) {
        console.warn("⚠️ [Cloudinary] WARNING: Your Cloudinary API Key contains letters. You may have swapped API Key and Secret!");
    }
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
