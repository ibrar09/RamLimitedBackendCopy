import jwt from "jsonwebtoken";
import config from "../config/config.js";

export const generateAccessToken = (user) =>
  jwt.sign({ id: user.id, email: user.email, role: user.role }, config.jwt.secret, { expiresIn: "7d" });

export const generateRefreshToken = (user) =>
  jwt.sign({ id: user.id }, config.jwt.refreshSecret, { expiresIn: "30d" });
