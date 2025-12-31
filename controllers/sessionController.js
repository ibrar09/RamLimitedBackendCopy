// backend/controllers/sessionController.js
import Session from "../models/Session.js";

// Create new session when user logs in
export const createSession = async (userId, deviceInfo, ip) => {
  return await Session.create({
    userId,
    device: deviceInfo || "Unknown Device",
    ipAddress: ip || "Unknown IP",
    loggedInAt: new Date(),
    status: "active",
  });
};

// Get all active sessions for the logged-in user
export const getSessions = async (req, res) => {
  try {
    const userId = req.user.id;

    const sessions = await Session.findAll({
      where: { userId },
      order: [["loggedInAt", "DESC"]],
    });

    res.status(200).json({ success: true, sessions });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching sessions" });
  }
};

// Revoke (logout) a single session
export const revokeSession = async (req, res) => {
  try {
    const { sessionId } = req.body; // routes expect body

    const session = await Session.findByPk(sessionId);
    if (!session) return res.status(404).json({ message: "Session not found" });

    if (session.userId !== req.user.id) return res.status(403).json({ message: "Unauthorized" });

    session.status = "inactive"; // mark as revoked
    await session.save();

    res.status(200).json({ success: true, message: "Session revoked successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to revoke session" });
  }
};

// Logout from all devices
export const logoutAllDevices = async (req, res) => {
  try {
    const userId = req.user.id;
    await Session.destroy({ where: { userId } });
    res.status(200).json({ success: true, message: "All sessions cleared" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to logout all devices" });
  }
};
