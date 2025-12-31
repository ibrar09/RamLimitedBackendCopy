import { User, Product, Order } from "../models/index.js";

export const getAllUsers = async () => {
  return await User.findAll({
    attributes: ["id", "name", "email", "role", "status", "createdAt"],
    order: [["createdAt", "DESC"]],
  });
};

export const getUserById = async (id) => {
  return await User.findByPk(id, {
    attributes: ["id", "name", "email", "role", "status", "createdAt"],
  });
};

export const updateUser = async (id, data) => {
  const user = await User.findByPk(id);
  if (!user) throw new Error("User not found");

  return await user.update(data);
};

export const deleteUser = async (id) => {
  const user = await User.findByPk(id);
  if (!user) throw new Error("User not found");

  return await user.destroy();
};
