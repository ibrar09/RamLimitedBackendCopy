// services/supportTicketService.js
import { SupportTicket } from "../models/index.js";

export const createSupportTicket = async (data) => {
  return await SupportTicket.create(data);
};

export const getAllSupportTickets = async () => {
  return await SupportTicket.findAll();
};

export const getSupportTicketById = async (id) => {
  return await SupportTicket.findByPk(id);
};

export const updateSupportTicket = async (id, data) => {
  const ticket = await SupportTicket.findByPk(id);
  if (!ticket) return null;
  return await ticket.update(data);
};

export const deleteSupportTicket = async (id) => {
  const ticket = await SupportTicket.findByPk(id);
  if (!ticket) return null;
  await ticket.destroy();
  return true;
};
