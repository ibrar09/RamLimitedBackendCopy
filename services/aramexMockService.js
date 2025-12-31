// backend/services/aramexMockService.js

import crypto from "crypto";

export const createShipmentMock = async (order) => {
  // Generate fake AWB number
  const awb = "AWB" + crypto.randomInt(10000000, 99999999);

  return {
    success: true,
    message: "Mock shipment created successfully",
    waybill: awb,
    estimated_delivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // +3 days
  };
};

export const trackShipmentMock = async (waybill) => {
  // Fake tracking steps
  const trackingHistory = [
    {
      status: "Shipment Created",
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
    {
      status: "Picked Up",
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      status: "In Transit",
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
    {
      status: "Out for Delivery",
      date: new Date(),
    },
  ];

  return {
    success: true,
    waybill,
    tracking: trackingHistory,
  };
};
