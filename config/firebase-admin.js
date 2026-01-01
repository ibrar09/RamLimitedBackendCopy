import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

let firebaseAdmin = null;

console.log("🔍 [Firebase Admin] Checking FIREBASE_SERVICE_ACCOUNT environment variable...");
console.log("🔍 [Firebase Admin] Variable exists:", !!process.env.FIREBASE_SERVICE_ACCOUNT);
console.log("🔍 [Firebase Admin] Variable length:", process.env.FIREBASE_SERVICE_ACCOUNT?.length || 0);

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
        console.log("🔍 [Firebase Admin] Attempting to parse JSON...");
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        console.log("🔍 [Firebase Admin] JSON parsed successfully. Project ID:", serviceAccount.project_id);

        firebaseAdmin = admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            storageBucket: "ramlimitedphotos.firebasestorage.app"
        });
        console.log("✅ [Firebase Admin] Initialized with Service Account");
    } catch (error) {
        console.error("❌ [Firebase Admin] Failed to initialize:", error.message);
        console.error("❌ [Firebase Admin] Error stack:", error.stack);
    }
} else {
    console.log("⚠️ [Firebase Admin] Not initialized. Falling back to local Auth/Storage.");
}

export default firebaseAdmin;
