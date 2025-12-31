import * as db from "../models/index.js";

const { Product, ProductVariant, Order, OrderItem, sequelize } = db;

const testStockDeduction = async () => {
  try {
    console.log("Models loaded:", {
      hasOrder: !!Order,
      hasProduct: !!Product
    });

    const orderId = 241;

    const order = await Order.findOne({
      where: { id: orderId },
      include: [
        {
          model: OrderItem,
          as: "items",   // MUST match your association
          include: [
            { model: Product, as: "productDetails" },
            { model: ProductVariant, as: "variant" },
          ]
        }
      ]
    });

    if (!order) {
      console.log("❌ Order not found.");
      return;
    }

    console.log("Order found:", order.id);

    const orderedItems = order.items || [];

    if (!Array.isArray(orderedItems)) {
      console.log("❌ Ordered items is NOT an array. Received:", orderedItems);
      return;
    }

    if (orderedItems.length === 0) {
      console.log("❌ Order has NO items.");
      return;
    }

    console.log(`Found ${orderedItems.length} order items.`);

    // ----------------------------------------
    // STOCK DEDUCTION LOGIC
    // ----------------------------------------
    for (const item of orderedItems) {
      console.log("\nProcessing Item:", item.id);

      if (!item.variant) {
        console.log("❌ No variant found for item", item.id);
        continue;
      }

      const variant = item.variant;

      console.log(`Variant ID: ${variant.id}`);
      console.log(`Before stock: ${variant.size_stock}`);

      if (variant.size_stock < item.quantity) {
        console.log("❌ Not enough stock for variant:", variant.id);
        continue;
      }

      // deduct stock
      variant.size_stock -= item.quantity;
      await variant.save();

      console.log(`After stock: ${variant.size_stock}`);
    }

    console.log("\n✅ STOCK DEDUCTION TEST COMPLETED.");

  } catch (error) {
    console.error("❌ Test Error:", error);
  } finally {
    await sequelize.close();
  }
};

testStockDeduction();
