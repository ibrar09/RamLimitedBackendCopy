import { sequelize, Invoice } from "../models/index.js";


export const generateInvoiceNumber = async (transaction) => {
  const [result] = await sequelize.query(
    "SELECT nextval('invoice_seq') AS seq",
    { transaction }
  );

  const year = new Date().getFullYear();
  return `INV-${year}-${String(result[0].seq).padStart(6, "0")}`;
};
