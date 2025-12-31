
import { sequelize } from "./models/index.js";

async function safeExec(query) {
    try {
        await sequelize.query(query);
        console.log(`Executed: ${query}`);
    } catch (e) {
        console.log(`Skipped/Failed: ${query} - ${e.message.split('\n')[0]}`);
    }
}

async function syncDB() {
    try {
        await sequelize.authenticate();
        console.log("PostgreSQL connected successfully!");

        // 1. Clean up orphaned data to prevent FK errors
        // Invoices with bad order_id
        await safeExec(`DELETE FROM "invoices" WHERE "order_id" NOT IN (SELECT "id" FROM "orders")`);
        // Invoices with bad user_id
        await safeExec(`DELETE FROM "invoices" WHERE "user_id" NOT IN (SELECT "id" FROM "users")`);


        // 2. Manual Migrations: Drop Defaults first, then Alter Type
        const migrations = [
            // Users
            `ALTER TABLE "users" ALTER COLUMN "status" DROP DEFAULT`,
            `ALTER TABLE "users" ALTER COLUMN "status" TYPE VARCHAR USING "status"::VARCHAR`,
            `ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT`,
            `ALTER TABLE "users" ALTER COLUMN "role" TYPE VARCHAR USING "role"::VARCHAR`,
            `ALTER TABLE "users" ALTER COLUMN "provider" DROP DEFAULT`,
            `ALTER TABLE "users" ALTER COLUMN "provider" TYPE VARCHAR USING "provider"::VARCHAR`,

            // Products
            `ALTER TABLE "products" ALTER COLUMN "status" DROP DEFAULT`,
            `ALTER TABLE "products" ALTER COLUMN "status" TYPE VARCHAR USING "status"::VARCHAR`,

            // Orders
            `ALTER TABLE "orders" ALTER COLUMN "status" DROP DEFAULT`,
            `ALTER TABLE "orders" ALTER COLUMN "status" TYPE VARCHAR USING "status"::VARCHAR`,
            `ALTER TABLE "orders" ALTER COLUMN "payment_status" DROP DEFAULT`,
            `ALTER TABLE "orders" ALTER COLUMN "payment_status" TYPE VARCHAR USING "payment_status"::VARCHAR`,
            `ALTER TABLE "orders" ALTER COLUMN "payment_method" DROP DEFAULT`,
            `ALTER TABLE "orders" ALTER COLUMN "payment_method" TYPE VARCHAR USING "payment_method"::VARCHAR`,

            // Payments
            `ALTER TABLE "payments" ALTER COLUMN "status" DROP DEFAULT`,
            `ALTER TABLE "payments" ALTER COLUMN "status" TYPE VARCHAR USING "status"::VARCHAR`,
            `ALTER TABLE "payments" ALTER COLUMN "payment_method" DROP DEFAULT`,
            `ALTER TABLE "payments" ALTER COLUMN "payment_method" TYPE VARCHAR USING "payment_method"::VARCHAR`,

            // Shipments
            `ALTER TABLE "shipments" ALTER COLUMN "status" DROP DEFAULT`,
            `ALTER TABLE "shipments" ALTER COLUMN "status" TYPE VARCHAR USING "status"::VARCHAR`,

            // Support Tickets
            `ALTER TABLE "support_tickets" ALTER COLUMN "status" DROP DEFAULT`,
            `ALTER TABLE "support_tickets" ALTER COLUMN "status" TYPE VARCHAR USING "status"::VARCHAR`,
            `ALTER TABLE "support_tickets" ALTER COLUMN "priority" DROP DEFAULT`,
            `ALTER TABLE "support_tickets" ALTER COLUMN "priority" TYPE VARCHAR USING "priority"::VARCHAR`,

            // Product Reviews
            `ALTER TABLE "product_reviews" ALTER COLUMN "reviewer_type" DROP DEFAULT`,
            `ALTER TABLE "product_reviews" ALTER COLUMN "reviewer_type" TYPE VARCHAR USING "reviewer_type"::VARCHAR`,
            `ALTER TABLE "product_reviews" ALTER COLUMN "status" DROP DEFAULT`,
            `ALTER TABLE "product_reviews" ALTER COLUMN "status" TYPE VARCHAR USING "status"::VARCHAR`,

            // Quotations
            `ALTER TABLE "quotations" ALTER COLUMN "status" DROP DEFAULT`,
            `ALTER TABLE "quotations" ALTER COLUMN "status" TYPE VARCHAR USING "status"::VARCHAR`,

            // Invoice Requests
            `ALTER TABLE "invoice_requests" ALTER COLUMN "status" DROP DEFAULT`,
            `ALTER TABLE "invoice_requests" ALTER COLUMN "status" TYPE VARCHAR USING "status"::VARCHAR`,

            // Coupons (just in case DB has enum)
            `ALTER TABLE "coupons" ALTER COLUMN "status" DROP DEFAULT`,
            `ALTER TABLE "coupons" ALTER COLUMN "status" TYPE VARCHAR USING "status"::VARCHAR`,
        ];

        for (const query of migrations) {
            await safeExec(query);
        }

        // Sync core dependencies
        const { User, UserAddress, Product, ProductDetail, Order, Payment, Shipment, SupportTicket, ProductReview, Quotation, Invoice, InvoiceRequest } = sequelize.models;

        console.log("Syncing User...");
        await User.sync({ alter: true });

        console.log("Syncing UserAddress...");
        await UserAddress.sync({ alter: true });

        console.log("Syncing Product...");
        await Product.sync({ alter: true });

        console.log("Syncing ProductDetail...");
        await ProductDetail.sync({ alter: true });

        console.log("Syncing Order...");
        await Order.sync({ alter: true });

        console.log("Syncing Payment...");
        await Payment.sync({ alter: true });

        console.log("Syncing Shipment...");
        await Shipment.sync({ alter: true });

        console.log("Syncing SupportTicket...");
        await SupportTicket.sync({ alter: true });

        console.log("Syncing ProductReview...");
        await ProductReview.sync({ alter: true });

        console.log("Syncing Quotation...");
        await Quotation.sync({ alter: true });

        console.log("Syncing Invoice...");
        await Invoice.sync({ alter: true });

        console.log("Syncing InvoiceRequest...");
        await InvoiceRequest.sync({ alter: true });

        console.log("Syncing all remaining...");
        await sequelize.sync({ alter: true });
        console.log("✅ All tables synchronized successfully");
        process.exit(0);
    } catch (error) {
        console.error("Unable to connect to DB or sync:", error);
        process.exit(1);
    }
}

syncDB();
