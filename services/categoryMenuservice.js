// services/categoryMenu.service.js
import { Category, Product } from "../models/index.js";

export const getCategoryMenuData = async () => {
  try {
    const categories = await Category.findAll({
      include: [
        {
          model: Product,
          as: "products",
          attributes: ["id", "name", "subcategory", "slug"], // ✅ add slug here
        },
      ],
      order: [["name", "ASC"]],
    });

    return categories.map((cat) => {
      const grouped = {};

      // Ensure cat.products exists and is an array
      const products = Array.isArray(cat.products) ? cat.products : [];

      // Group products under their subcategory
      products.forEach((p) => {
        const sub = p.subcategory?.trim() || "Other"; // ✅ fallback to "Other"
        const productName = p.name?.trim() || "Unnamed Product"; // ✅ fallback name
        grouped[sub] = grouped[sub] || [];
        grouped[sub].push({
          id: p.id,
          name: productName,
          slug: p.slug || null, // ✅ include slug for frontend navigation
        });
      });

      // Format for frontend
      const subcategories = Object.entries(grouped).map(([name, products]) => ({
        id: name, // Use name as ID for string-based subcategories
        name: name || "Other",
        slug: slugify(name || "other", { lower: true, strict: true }), // Generate slug for subcategory
        products,
      }));

      return {
        id: cat.id,
        slug: cat.slug, // ✅ Pass category slug
        category: cat.name?.trim() || "Unnamed Category",
        subcategories,
      };
    });
  } catch (error) {
    console.error("Error fetching category menu:", error);
    throw new Error("Failed to fetch category menu");
  }
};
