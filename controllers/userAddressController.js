import {
  createAddressService,
  getUserAddressesService,
  updateAddressService,
  deleteAddressService,
  getAllAddressesService,
} from "../services/userAddressService.js";

// controllers/userAddressController.js
import { UserAddress, User ,Order } from "../models/index.js"; // make sure the path is correct


// Create new address for logged-in user
export const createAddress = async (req, res) => {
  try {
    const address = await createAddressService(req.body, req.user.id);
    res.status(201).json({ message: "Address created", address });
  } catch (err) {
    console.error("Error in createAddress:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Get all addresses of logged-in user
export const getUserAddresses = async (req, res) => {
  try {
    const addresses = await getUserAddressesService(req.user.id, 3); // limit 3
    res.json(addresses);
  } catch (err) {
    console.error("Error in getUserAddresses:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Get all addresses (Admin only)
export const getAllAddresses = async (req, res) => {
  try {
    const addresses = await UserAddress.findAll({
      include: [
        {
          model: User, // no "as" here since none is defined
          attributes: ["id", "name", "email"],
        },
      ],
    });
    res.json(addresses);
  } catch (err) {
    console.error("Error in getAllAddresses:", err.message);
    res.status(500).json({ error: "Failed to fetch addresses" });
  }
};


// Update an address
export const updateAddress = async (req, res) => {
  try {
    const address = await updateAddressService(
      req.params.id,
      req.body,
      req.user.id,
      req.user.role === "admin"
    );
    res.json({ message: "Address updated successfully", address });
  } catch (err) {
    console.error("Error in updateAddress:", err.message);
    res.status(err.message === "Access denied" ? 403 : 500).json({ error: err.message });
  }
};


// Delete an address
export const deleteAddress = async (req, res) => {
  try {
    await deleteAddressService(req.params.id, req.user.id, req.user.role === "admin");
    res.json({ message: "Address deleted" });
  } catch (err) {
    console.error("Error in deleteAddress:", err.message);
    res.status(err.message === "Access denied" ? 403 : 500).json({ error: err.message });
  }
};
