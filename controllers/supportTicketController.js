// controllers/supportTicketController.js
import {
  createSupportTicket,
  getAllSupportTickets,
  getSupportTicketById,
  updateSupportTicket,
  deleteSupportTicket,
} from "../services/supportTicketService.js";

export const createTicket = async (req, res) => {
  try {
    const ticket = await createSupportTicket(req.body);
    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTickets = async (req, res) => {
  try {
    const tickets = await getAllSupportTickets();
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTicket = async (req, res) => {
  try {
    const ticket = await getSupportTicketById(req.params.id);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateTicket = async (req, res) => {
  try {
    const ticket = await updateSupportTicket(req.params.id, req.body);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteTicket = async (req, res) => {
  try {
    const success = await deleteSupportTicket(req.params.id);
    if (!success) return res.status(404).json({ message: "Ticket not found" });
    res.json({ message: "Ticket deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
