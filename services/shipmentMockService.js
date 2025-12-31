// File: services/shipmentMockService.js
// This simulates DHL API for testing purposes without real DHL account

export const createShipment = async (shipmentData) => {
  const trackingNumber = `TEST-${Math.floor(Math.random() * 1000000)}`;

  const mockShipment = {
    id: Math.floor(Math.random() * 10000),
    order_id: shipmentData.order_id,
    tracking_number: trackingNumber,
    courier_name: "DHL Express",
    shipped_date: new Date(),
    delivery_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days later
    status: "in-transit",
    notes: "This is a mock DHL shipment",
    created_at: new Date()
  };

  return mockShipment;
};

export const trackShipment = async (trackingNumber) => {
  return {
    tracking_number: trackingNumber,
    courier_name: "DHL Express",
    status: "in-transit",
    history: [
      { date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), location: "Riyadh", status: "Shipment received at warehouse" },
      { date: new Date(), location: "Riyadh", status: "In transit to delivery" }
    ]
  };
};
