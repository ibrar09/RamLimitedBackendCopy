// services/aramexService.js
import axios from "axios";
import dotenv from "dotenv";
// import dns from "dns";

// dns.setDefaultResultOrder("ipv4first");

dotenv.config();

const ARAMEX_BASE_URL = process.env.ARAMEX_SANDBOX === "true"
  ? "https://ws.dev.aramex.net/shippingapi.v2/shipping/service_1_0.svc/json/"
  : "https://ws.aramex.net/shippingapi.v2/shipping/service_1_0.svc/json/";

// ---------- Common headers & auth ----------
const getAuth = () => ({
  ClientInfo: {
    UserName: process.env.ARAMEX_USERNAME,
    Password: process.env.ARAMEX_PASSWORD,
    Version: process.env.ARAMEX_VERSION || "v1.0",
    AccountNumber: process.env.ARAMEX_ACCOUNT_NUMBER,
    AccountPin: process.env.ARAMEX_ACCOUNT_PIN,
    AccountEntity: process.env.ARAMEX_ACCOUNT_ENTITY,
    AccountCountryCode: process.env.ARAMEX_ACCOUNT_COUNTRY_CODE,
  }
});

// ---------- Create shipment ----------
export const createAramexShipment = async (shipment) => {
  const payload = {
    ...getAuth(),
    Shipments: [
      {
        Shipper: {
          Reference1: "Store",
          PartyAddress: {
            Line1: process.env.STORE_ADDRESS_LINE1,
            City: process.env.STORE_CITY, 
            CountryCode: process.env.STORE_COUNTRY_CODE || "SA"
          },
          Contact: {
            PersonName: process.env.STORE_CONTACT_NAME,
            CompanyName: process.env.STORE_COMPANY,
            PhoneNumber1: process.env.STORE_PHONE,
            EmailAddress: process.env.STORE_EMAIL
          }
        },

        Consignee: {
          Reference1: shipment.order_number,
          PartyAddress: {
            Line1: shipment.address,
            City: shipment.city === "riyad" ? "Riyadh" : shipment.city,
            CountryCode: "SA" // ALWAYS ISO CODE
          },
          Contact: {
            PersonName: shipment.contact_name,
            CompanyName: shipment.company || "",
            PhoneNumber1: shipment.phone_number,
            EmailAddress: shipment.email
          }
        },

        Reference1: shipment.order_number,

        Payment: {
          PaymentType: "P",
          Amount: Number(shipment.amount), // MUST BE NUMBER
          CurrencyCode: shipment.currency || "SAR"
        },

        PackageType: "Box",
        ProductGroup: "EXP",
        ProductType: "OND",

        ActualWeight: { Value: shipment.weight || 1, Unit: "KG" },
        NumberOfPieces: shipment.pieces || 1,
        DescriptionOfGoods: shipment.description || "Products"
      }
    ]
  };

  console.log("📤 FINAL ARAMEX PAYLOAD:", JSON.stringify(payload, null, 2));

  try {
    const response = await axios.post(
      `${ARAMEX_BASE_URL}CreateShipments`,
      payload
    );
    console.log("✅ Aramex Response:", response.data);
    return response.data;
  } catch (err) {
    console.error("❌ ARAMEX ERROR RAW:", err.response?.data);
    console.error("❌ MESSAGE:", err.message);
    throw new Error("Aramex API Error");
  }
};


// ---------- Track shipment ----------
export const trackAramexShipment = async (trackingNumber) => {
  const payload = {
    ...getAuth(),
    Shipments: [{ WaybillNumber: trackingNumber }]
  };

  console.log("📤 Aramex TrackShipments Payload:", JSON.stringify(payload, null, 2));

  try {
    const response = await axios.post(`${ARAMEX_BASE_URL}TrackShipments`, payload);
    console.log("✅ Aramex track response:", response.data);
    return response.data;
  } catch (err) {
    console.error("❌ Aramex track shipment error:", err.response?.data || err.message);
    throw new Error("Aramex API Track Error");
  }
};
