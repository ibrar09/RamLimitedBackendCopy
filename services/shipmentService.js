// services/shipmentService.js
import { Shipment, Order } from "../models/index.js";

export const createShipment = async (data) => {
  return await Shipment.create(data);
};

export const getAllShipments = async () => {
  return await Shipment.findAll({
    include: [
      { model: Order, as: "order", attributes: ["order_number", "status"] },
    ],
    order: [["created_at", "DESC"]],
  });
};

export const getShipmentById = async (id) => {
  return await Shipment.findByPk(id);
};

export const updateShipment = async (id, data) => {
  const shipment = await Shipment.findByPk(id);
  if (!shipment) throw new Error("Shipment not found");

  const fields = ["status", "tracking_number", "courier_name", "shipped_date", "delivery_date", "admin_comment"];
  fields.forEach((field) => {
    if (data[field] !== undefined) shipment[field] = data[field];
  });

  if (shipment.status === "shipped") {
    if (!shipment.tracking_number || !shipment.courier_name) {
      throw new Error("Courier name and tracking number are required for shipped orders");
    }
    if (!shipment.shipped_date) shipment.shipped_date = new Date();
  }

  await shipment.save();

  // Sync order status
  const order = await Order.findByPk(shipment.order_id);
  if (order) {
    order.status = shipment.status;
    await order.save();
  }

  return shipment;
};

export const deleteShipment = async (id) => {
  const shipment = await Shipment.findByPk(id);
  if (!shipment) throw new Error("Shipment not found");
  await shipment.destroy();
};

export const getShipmentsByOrder = async (order_id) => {
  return await Shipment.findAll({ where: { order_id } });
};

export const getShipmentsByUser = async (userId) => {
  return await Shipment.findAll({
    include: [
      { model: Order, as: "order", where: { user_id: userId }, attributes: ["id", "order_number", "status"] },
    ],
    order: [["created_at", "DESC"]],
  });
};

// -------------------------------
// Generate courier tracking URL (Saudi-specific)
// -------------------------------
export const getTrackingUrl = (shipment) => {
  if (!shipment.tracking_number || !shipment.courier_name) return null;

  const t = shipment.tracking_number;
  const courier = shipment.courier_name.toLowerCase();

  const urls = {
    aramex: `https://www.aramex.com/track/track-results?trackingNumber=${t}`, // pre-fills
    smsa: `https://www.smsaexpress.com/tracking-details?trackNumbers=${t}`,  // pre-fills
    fetchr: `https://fetchr.com/track?tracking_number=${t}`, // pre-fills
    dhl: `https://www.dhl.com/en/express/tracking.html?AWB=${t}`, // may not pre-fill
    fedex: `https://www.fedex.com/fedextrack/?trknbr=${t}`,       // may not pre-fill
    ups: `https://www.ups.com/track?tracknum=${t}`,               // may not pre-fill
  };

  return urls[courier] || null;
};
