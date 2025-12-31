import { UserAddress, User ,Order } from "../models/index.js";

// Create a new address
export const createAddressService = async (data, userId) => {
  // Attach userId from JWT
  return await UserAddress.create({ ...data, user_id: userId });
};

// Get all addresses of a specific user
export const getUserAddressesService = async (userId, limit = 3) => {
  return await UserAddress.findAll({
    where: { user_id: userId },
    order: [["createdAt", "DESC"]], // latest first
    limit, // only fetch `limit` addresses
  });
};

// Get all addresses (Admin)
export const getAllAddressesService = async () => {
  return await UserAddress.findAll({
    include: [
      {
        model: User,
        as: "user",
        attributes: ["id", "name", "email"],
      },
    ],
  });
};

// Update an address by ID
export const updateAddressService = async (id, data, userId, isAdmin = false) => {
  const address = await UserAddress.findByPk(id);
  if (!address) throw new Error("Address not found");

  // Only allow update if user owns it or is admin
  if (!isAdmin && address.user_id !== userId) {
    throw new Error("Access denied");
  }

  // Optional: Prevent update if address is linked to shipped/completed orders
  const linkedOrders = await Order.count({ where: { address_id: id } });
  if (linkedOrders > 0) {
    // You can allow update or restrict specific fields only
    // For example, maybe admin can update phone / full_name, but not address_line1/2
    // throw new Error("Cannot update address linked to existing orders");
  }

  return await address.update(data);
};

// Delete an address by ID

export const deleteAddressService = async (id, userId, isAdmin = false) => {
  const address = await UserAddress.findByPk(id);
  if (!address) throw new Error("Address not found");

  if (!isAdmin && address.user_id !== userId) throw new Error("Access denied");

  // Check if any order uses this address
  const orderCount = await Order.count({ where: { address_id: id } });
  if (orderCount > 0) throw new Error("Cannot delete address: linked to existing orders");

  return await address.destroy();
};
