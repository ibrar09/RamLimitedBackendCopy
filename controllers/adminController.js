import { User, Product, Order } from "../models/index.js";


// ---------------------- Admin Dashboard ----------------------
export const getAdminDashboard = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const activeUsers = await User.count({ where: { status: "active" } });
    const admins = await User.count({ where: { role: "admin" } });

    return res.status(200).json({
      message: "Admin dashboard data retrieved successfully",
      data: {
        totalUsers,
        activeUsers,
        admins,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ---------------------- Get All Users ----------------------
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "name", "email", "phone", "role", "status", "createdAt", "updatedAt"],
      order: [["createdAt", "DESC"]],
    });
    return res.status(200).json({ data: users });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ---------------------- Get User by ID ----------------------
export const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id, {
      attributes: ["id", "name", "email", "phone", "role", "status", "createdAt", "updatedAt"],
    });
    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json({ data: user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ---------------------- Update User ----------------------
export const updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, role, status } = req.body;

  try {
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.update({ name, email, phone, role, status });
    return res.status(200).json({ message: "User updated successfully", data: user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ---------------------- Delete User ----------------------
export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.destroy();
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
