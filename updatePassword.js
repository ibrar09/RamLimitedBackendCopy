import bcrypt from "bcrypt";
import { User } from "./models/index.js"; // adjust path if needed
import dotenv from "dotenv";

dotenv.config(); // if you use environment variables for DB

const updatePassword = async () => {
  try {
    const email = "seibrarahmad@gmail.com"; // user email
    const newPassword = "string123"; // the plain password you want to use

    // Generate new hash
    const saltRounds = 10;
    const hash = await bcrypt.hash(newPassword, saltRounds);
    console.log("New hash generated:", hash);

    // Update user in DB
    const [updated] = await User.update(
      { password: hash },
      { where: { email } }
    );

    if (updated) {
      console.log(`Password updated successfully for ${email}`);
    } else {
      console.log(`User with email ${email} not found`);
    }

    process.exit(0); // exit script
  } catch (err) {
    console.error("Error updating password:", err);
    process.exit(1);
  }
};

updatePassword();
