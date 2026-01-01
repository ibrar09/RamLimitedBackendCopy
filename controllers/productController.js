import { Product, Category, Brand, ProductDetail, OrderItem, ProductReview, User } from "../models/index.js";
import { Op } from "sequelize";
import { searchProductsService } from "../services/productService.js";
import { translateText } from "../utils/translator.js";
import slugify from 'slugify';

/* ---------------- HELPERS ---------------- */

import fs from 'fs';


const parseJSONSafe = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;

  let parsed = value;
  try {
    // Attempt to parse multiple times (handle double/triple stringified)
    for (let i = 0; i < 3; i++) {
      if (typeof parsed === "string") {
        try {
          const temp = JSON.parse(parsed);
          parsed = temp;
        } catch {
          break; // Stop if not valid JSON
        }
      } else {
        break; // Stop if already an object/array
      }
    }
  } catch (err) {
    console.error("parseJSONSafe error:", err);
  }

  return Array.isArray(parsed) ? parsed : [];
};

const normalizeBool = (val) =>
  val === true || val === "true" || val === 1 || val === "1";

/**
 * ✅ FIX: ProductDetail is HAS ONE, not array
 */
const normalizeDetails = (details) => {
  if (!details) return null;

  return {
    ...details,
    feature_ar: details.feature_ar || details.feature,
    note_ar: details.note_ar || details.note,
  };
};

/* ---------------- GET ALL PRODUCTS ---------------- */
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      where: { is_deleted: false },

      // ✅ ADD THIS
      order: [
        ["is_new_release", "DESC"],
        ["is_best_seller", "DESC"],
        ["is_hot_deal", "DESC"],
        ["created_at", "DESC"],
      ],

      include: [
        { model: Category, as: "category", attributes: ["id", "name"] },
        { model: Brand, as: "brand", attributes: ["id", "name"] },
        { model: ProductDetail, as: "details" },
      ],
    });


    const result = products.map((p) => {
      const plain = p.get({ plain: true });

      return {
        ...plain,
        category_name: plain.category?.name || "-",
        brand_name: plain.brand?.name || "-",
        image_urls: parseJSONSafe(plain.image_urls),
        key_features: parseJSONSafe(plain.key_features),
        key_features_ar: parseJSONSafe(plain.key_features_ar),
        name_ar: plain.name_ar || plain.name,
        description_ar: plain.description_ar || plain.description,
        subcategory_ar: plain.subcategory_ar || plain.subcategory,
        details: normalizeDetails(plain.details),
      };
    });

    return res.json({ success: true, data: result });
  } catch (err) {
    console.error("getAllProducts error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/* ---------------- GET PRODUCT BY ID ---------------- */
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [
        { model: Category, as: "category", attributes: ["id", "name"] },
        { model: Brand, as: "brand", attributes: ["id", "name"] },
        { model: ProductDetail, as: "details" },
        // ✅ Include approved reviews with reviewer name
        {
          model: ProductReview,
          as: "reviews",
          where: { status: "approved" },
          required: false, // allow products with zero reviews
          include: [
            {
              model: User,
              as: "reviewer", // match the new alias in index.js
              attributes: ["id", "name"],
            },
          ],
        },
      ],
    });

    if (!product)
      return res.status(404).json({ success: false, message: "Product not found" });

    const plain = product.get({ plain: true });

    return res.json({
      success: true,
      data: {
        ...plain,
        category_name: plain.category?.name || "-",
        brand_name: plain.brand?.name || "-",

        image_urls: parseJSONSafe(plain.image_urls),
        key_features: parseJSONSafe(plain.key_features),
        key_features_ar: parseJSONSafe(plain.key_features_ar),

        name_ar: plain.name_ar || plain.name,
        description_ar: plain.description_ar || plain.description,
        subcategory_ar: plain.subcategory_ar || plain.subcategory,

        details: normalizeDetails(plain.details),

        // ✅ Map reviews using the correct alias
        reviews: plain.reviews?.map(r => ({
          id: r.id,
          rating: r.rating,
          review_text: r.review_text,
          reviewer_name: r.reviewer?.name || "Anonymous", // updated alias
          created_at: r.created_at,
        })) || [],
      },
    });
  } catch (err) {
    console.error("getProductById error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/* ---------------- CREATE PRODUCT ---------------- */
export const createProduct = async (req, res) => {
  try {
    console.log("📝 [Backend] createProduct request received.");
    const {
      name,
      description,
      price,
      oldprice,
      stock,
      category_id,
      brand_id,
      sku,
      key_features,
      status,
      subcategory,
      is_new_release,
      is_best_seller,
      is_hot_deal,
      // material,
      color,
      size,
      feature,
      model_number,
      payment,
      usage,
      delivery_time,
      note,
    } = req.body;

    const files = req.files || [];
    const localUploadedImages = files.map((f) => `/uploads/${f.filename}`);

    // Support hybrid image URLs (e.g., from Firebase)
    let finalImages = [...localUploadedImages];
    if (req.body.image_urls) {
      const incomingUrls = parseJSONSafe(req.body.image_urls);
      finalImages = [...finalImages, ...incomingUrls];
    }

    if (!name || !price || !category_id || !brand_id) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    /* 🔹 AUTO TRANSLATE */
    const name_ar = await translateText(name);
    const description_ar = await translateText(description);
    const subcategory_ar = await translateText(subcategory);
    const feature_ar = feature ? await translateText(feature) : null;
    const note_ar = note ? await translateText(note) : null;

    /* 🔹 GENERATE SLUG */
    const slug = slugify(name, { lower: true, strict: true });

    const product = await Product.create({
      name,
      name_ar,
      description,
      description_ar,
      price: Number(price),
      oldprice: oldprice ? Number(oldprice) : null,
      stock: stock ? Number(stock) : 0,
      category_id,
      brand_id,
      sku,
      subcategory,
      subcategory_ar,
      image_urls: JSON.stringify(finalImages),
      key_features: JSON.stringify(key_features || []),
      status,
      is_new_release: normalizeBool(is_new_release),
      is_best_seller: normalizeBool(is_best_seller),
      is_hot_deal: normalizeBool(is_hot_deal),
      slug, // ✅ add slug here
    });

    await ProductDetail.create({
      product_id: product.id,
      // material,
      color,
      size,
      feature,
      feature_ar,
      model_number,
      payment,
      usage,
      delivery_time,
      note,
      note_ar,
    });

    return getProductById({ params: { id: product.id } }, res);
  } catch (err) {
    console.error("createProduct error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/* ---------------- UPDATE PRODUCT ---------------- */
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    /* ---------------- IMAGES ---------------- */

    const files = req.files || [];
    const localUploadedImages = files.map((f) => `/uploads/${f.filename}`);
    const existingImages = parseJSONSafe(product.image_urls);

    // ✅ Merge old + new local images + incoming remote URLs
    let finalImages = [...existingImages, ...localUploadedImages];
    if (req.body.image_urls) {
      const incomingUrls = parseJSONSafe(req.body.image_urls);
      // Avoid duplication if they are already in existing
      const newUnique = incomingUrls.filter(u => !existingImages.includes(u));
      finalImages = [...finalImages, ...newUnique];
    }

    /* ---------------- BODY ---------------- */

    const {
      name,
      description,
      price,
      oldprice,
      stock,
      category_id,
      brand_id,
      sku,
      key_features,
      status,
      subcategory,
      is_new_release,
      is_best_seller,
      is_hot_deal,
      // material,
      color,
      size,
      feature,
      model_number,
      payment,
      usage,
      delivery_time,
      note,
    } = req.body;

    /* ---------------- TRANSLATION ---------------- */

    const name_ar = name ? await translateText(name) : product.name_ar;
    const description_ar = description
      ? await translateText(description)
      : product.description_ar;
    const subcategory_ar = subcategory
      ? await translateText(subcategory)
      : product.subcategory_ar;
    const feature_ar = feature ? await translateText(feature) : undefined;
    const note_ar = note ? await translateText(note) : undefined;

    /* ---------------- PRODUCT UPDATE ---------------- */

    await product.update({
      name: name ?? product.name,
      name_ar,
      description: description ?? product.description,
      description_ar,
      price: price ? Number(price) : product.price,
      oldprice: oldprice ? Number(oldprice) : product.oldprice,
      stock: stock ? Number(stock) : product.stock,
      category_id: category_id ?? product.category_id,
      brand_id: brand_id ?? product.brand_id,
      sku: sku ?? product.sku,
      subcategory: subcategory ?? product.subcategory,
      subcategory_ar,
      image_urls: JSON.stringify(finalImages),
      key_features: key_features
        ? JSON.stringify(key_features)
        : product.key_features,
      status: status ?? product.status,
      is_new_release:
        is_new_release !== undefined
          ? normalizeBool(is_new_release)
          : product.is_new_release,
      is_best_seller:
        is_best_seller !== undefined
          ? normalizeBool(is_best_seller)
          : product.is_best_seller,
      is_hot_deal:
        is_hot_deal !== undefined
          ? normalizeBool(is_hot_deal)
          : product.is_hot_deal,
      slug: name ? slugify(name, { lower: true, strict: true }) : product.slug, // ✅ add slug update
    });

    /* ---------------- PRODUCT DETAILS ---------------- */

    const details = await ProductDetail.findOne({
      where: { product_id: product.id },
    });

    if (details) {
      await details.update({
        // material,
        color,
        size,
        feature,
        feature_ar,
        model_number,
        payment,
        usage,
        delivery_time,
        note,
        note_ar,
      });
    } else {
      await ProductDetail.create({
        product_id: product.id,
        // material,
        color,
        size,
        feature,
        feature_ar,
        model_number,
        payment,
        usage,
        delivery_time,
        note,
        note_ar,
      });
    }

    return getProductById({ params: { id: product.id } }, res);
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* ---------------- DELETE PRODUCT ---------------- */

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product)
      return res.status(404).json({ success: false, message: "Product not found" });

    // ✅ Soft delete instead of hard delete
    await product.update({ is_deleted: true });

    return res.json({ success: true, message: "Product removed from store" });
  } catch (err) {
    console.error("deleteProduct error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};




/* ---------------- SEARCH ---------------- */

export const searchProducts = async (req, res) => {
  try {
    const products = await searchProductsService(req.query.query);
    return res.json({ success: true, data: products });
  } catch (err) {
    console.error("searchProducts error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({
      where: { slug: req.params.slug, is_deleted: false },
      include: [
        { model: Category, as: "category", attributes: ["id", "name"] },
        { model: Brand, as: "brand", attributes: ["id", "name"] },
        { model: ProductDetail, as: "details" },
      ],
    });

    if (!product)
      return res.status(404).json({ success: false, message: "Product not found" });

    const plain = product.get({ plain: true });

    return res.json({
      success: true,
      data: {
        ...plain,
        category_name: plain.category?.name || "-",
        brand_name: plain.brand?.name || "-",
        image_urls: parseJSONSafe(plain.image_urls),
        key_features: parseJSONSafe(plain.key_features),
        key_features_ar: parseJSONSafe(plain.key_features_ar),
        name_ar: plain.name_ar || plain.name,
        description_ar: plain.description_ar || plain.description,
        subcategory_ar: plain.subcategory_ar || plain.subcategory,
        details: normalizeDetails(plain.details),
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/* ---------------- UPLOAD MULTIPLE (HELPER FOR HYBRID) ---------------- */
export const uploadMultiple = async (req, res) => {
  try {
    console.log("📥 [Backend] uploadMultiple (Fallback) triggered.");
    const files = req.files || [];
    console.log(`📸 [Backend] Received ${files.length} files for local storage.`);
    const imageUrls = files.map((f) => `/uploads/${f.filename}`);
    console.log("✅ [Backend] Local upload complete:", imageUrls);
    return res.json({ success: true, imageUrls });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
