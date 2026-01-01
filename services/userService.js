import { User, UserAddress } from "../models/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const createUser = async ({ name, email, password, phone }) => {
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) throw new Error("Email already in use");

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    phone,
    role: "user", // Default role for new users
    status: "active"
  });

  // Return user without password
  const userWithoutPassword = {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    status: user.status,
    created_at: user.created_at
  };

  return userWithoutPassword;
};

export const loginUserService = async ({ email, password }) => {
  try {
    console.log(`🔍 Attempting login for email: ${email}`);

    // Find user with all attributes
    const user = await User.findOne({
      where: { email },
      attributes: ['id', 'name', 'email', 'password', 'phone', 'role', 'status', 'created_at']
    });

    if (!user) {
      console.log(`❌ Login failed: No user found with email: ${email}`);
      throw new Error("Invalid email or password");
    }

    console.log(`✅ User found:`, {
      id: user.id,
      email: user.email,
      role: user.role,
      status: user.status
    });

    // Check if user account is active
    if (user.status !== "active") {
      console.log(`❌ Login failed: Account is ${user.status} for user: ${email}`);
      throw new Error(`Your account is ${user.status}. Please contact support.`);
    }

    // Verify password
    console.log(`🔐 Comparing password...`);
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      console.log(`❌ Login failed: Invalid password for user: ${email}`);
      throw new Error("Invalid email or password");
    }

    console.log(`✅ Password verified for user: ${email}`);

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        email: user.email
      },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "7d" }
    );

    // Return user without password
    const userWithoutPassword = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status,
      created_at: user.created_at
    };

    console.log(`🎉 Login successful for: ${email} (Role: ${user.role})`);

    return {
      user: userWithoutPassword,
      token
    };

  } catch (error) {
    console.error(`💥 Login error for ${email}:`, error.message);
    throw error;
  }
};

export const getAllUsersService = async () => {
  try {
    console.log("🔍 [getAllUsersService] Fetching all users...");
    const users = await User.findAll({
      attributes: [
        "id",
        "name",
        "email",
        "phone",
        "role",
        "status",
        "created_at"
      ],
      include: [
        {
          model: UserAddress,
          as: "UserAddresses", // must match the association alias
          attributes: ["id", "address_line1", "is_default"],
        },
      ],
    });

    console.log("✅ [getAllUsersService] Users fetched successfully");
    return users;
  } catch (err) {
    console.error("❌ [getAllUsersService] Error fetching users:", err);
    throw err;
  }
};


// Helper function to create an admin user (run this once)
export const createAdminUser = async () => {
  try {
    const adminEmail = "admin@maaj.com";

    // Check if admin already exists
    const existingAdmin = await User.findOne({ where: { email: adminEmail } });
    if (existingAdmin) {
      console.log("ℹ️ Admin user already exists:", existingAdmin.toJSON());
      return existingAdmin;
    }

    // Create admin user
    const adminUser = await User.create({
      name: "System Administrator",
      email: adminEmail,
      password: await bcrypt.hash("admin123", 10),
      phone: "1234567890",
      role: "admin",
      status: "active"
    });

    // Return without password
    const adminWithoutPassword = {
      id: adminUser.id,
      name: adminUser.name,
      email: adminUser.email,
      phone: adminUser.phone,
      role: adminUser.role,
      status: adminUser.status,
      created_at: adminUser.created_at
    };

    console.log("✅ Admin user created successfully:", adminWithoutPassword);
    return adminWithoutPassword;

  } catch (error) {
    console.error("❌ Error creating admin user:", error);
    throw error;
  }
};


// ---------------------------
// GET USER BY ID (NEW)
// ---------------------------
export const getUserByIdService = async (id) => {
  const user = await User.findOne({
    where: { id },
    attributes: ["id", "name", "email", "phone", "role", "status", "created_at"]
  });

  if (!user) throw new Error("User not found");

  return user;
};

export const updateUserService = async (id, data) => {
  const user = await User.findByPk(id);

  if (!user) throw new Error("User not found");

  // If password is sent, hash it
  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  }

  await user.update(data);

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    status: user.status,
    created_at: user.created_at
  };
};


export const getUserWithAddresses = async (userId) => {
  return await User.findByPk(userId, {
    attributes: ["id", "name", "email", "phone", "role"],
    include: [
      {
        model: UserAddress,
        as: "addresses",
        order: [["is_default", "DESC"]],
      },
    ],
  });
};
