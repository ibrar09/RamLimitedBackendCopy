import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

let firebaseAdmin = null;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        firebaseAdmin = admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            storageBucket: "ramlimitedphotos.firebasestorage.app"
        });
        console.log("✅ [Firebase Admin] Initialized with Service Account");
    } catch (error) {
        console.error("❌ [Firebase Admin] Failed to parse Service Account JSON:", error.message);
    }
} else {
    console.log("⚠️ [Firebase Admin] Not initialized. Falling back to local Auth/Storage.");
}

export default firebaseAdmin;
