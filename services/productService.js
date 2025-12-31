// services/productService.js
import { Product, Category, Brand, ProductDetail } from "../models/index.js";
import { Op } from "sequelize";

/* ===================== HELPERS ===================== */

// Safely parse JSON fields
const parseJSONSafe = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  try {
    return JSON.parse(value);
  } catch {
    return [];
  }
};

// Normalize boolean values
const normalizeBool = (val) =>
  val === true || val === "true" || val === 1 || val === "1";

// Ensure details is always an array
const normalizeDetailsArray = (details) => {
  if (!details) return [];
  if (Array.isArray(details)) return details;
  return [details];
};

/* ===================== GET ALL ===================== */
export const getAllProducts = async () => {
  const products = await Product.findAll({
    include: [
      { model: Category, as: "category", attributes: ["id", "name"] },
      { model: Brand, as: "brand", attributes: ["id", "name"] },
      { model: ProductDetail, as: "details" },
    ],
  });

  return products.map((p) => {
    const plain = p.get({ plain: true });
    return {
      ...plain,
      category_name: plain.category?.name || "-",
      brand_name: plain.brand?.name || "-",
      key_features: parseJSONSafe(plain.key_features),
      key_features_ar: parseJSONSafe(plain.key_features_ar),
      image_urls: parseJSONSafe(plain.image_urls),
      details: normalizeDetailsArray(plain.details).map((d) => ({
        ...d,
        feature_ar: d.feature_ar || d.feature,
        note_ar: d.note_ar || d.note,
      })),
    };
  });
};

/* ===================== GET BY ID ===================== */
export const getProductByIdService = async (id) => {
  const product = await Product.findByPk(id, {
    include: [
      { model: Category, as: "category", attributes: ["id", "name"] },
      { model: Brand, as: "brand", attributes: ["id", "name"] },
      { model: ProductDetail, as: "details" },
    ],
  });

  if (!product) return null;

  const plain = product.get({ plain: true });
  return {
    ...plain,
    category_name: plain.category?.name || "-",
    brand_name: plain.brand?.name || "-",
    key_features: parseJSONSafe(plain.key_features),
    key_features_ar: parseJSONSafe(plain.key_features_ar),
    image_urls: parseJSONSafe(plain.image_urls),
    details: normalizeDetailsArray(plain.details).map((d) => ({
      ...d,
      feature_ar: d.feature_ar || d.feature,
      note_ar: d.note_ar || d.note,
    })),
  };
};

/* ===================== CREATE ===================== */
export const createProductService = async (body, files = []) => {
  const images = files.map((f) => `/uploads/${f.filename}`);

  const product = await Product.create({
    name: body.name,
    description: body.description,
    price: Number(body.price),
    oldprice: body.oldprice ? Number(body.oldprice) : null,
    stock: body.stock ? Number(body.stock) : 0,
    category_id: body.category_id,
    brand_id: body.brand_id,
    sku: body.sku,
    subcategory: body.subcategory,
    image_urls: JSON.stringify(images),
    key_features: JSON.stringify(body.key_features || []),
    status: body.status || "active",
    is_new_release: normalizeBool(body.is_new_release),
    is_best_seller: normalizeBool(body.is_best_seller),
    is_hot_deal: normalizeBool(body.is_hot_deal),
  });

  await ProductDetail.create({
    product_id: product.id,
    // material: body.material,
    color: body.color,
    size: body.size,
    feature: body.feature,
    feature_ar: body.feature_ar,
    model_number: body.model_number,
    payment: body.payment,
    usage: body.usage,
    delivery_time: body.delivery_time,
    note: body.note,
    note_ar: body.note_ar,
  });

  return getProductByIdService(product.id);
};

/* ===================== UPDATE ===================== */
export const updateProductService = async (id, body, files = []) => {
  const product = await Product.findByPk(id);
  if (!product) throw new Error("Product not found");

  const images = files.map((f) => `/uploads/${f.filename}`);

  await product.update({
    ...body,
    image_urls: images.length ? JSON.stringify(images) : product.image_urls,
    key_features:
      body.key_features !== undefined
        ? JSON.stringify(body.key_features)
        : product.key_features,
    is_new_release: normalizeBool(body.is_new_release),
    is_best_seller: normalizeBool(body.is_best_seller),
    is_hot_deal: normalizeBool(body.is_hot_deal),
  });

  const [details] = await ProductDetail.findOrCreate({
    where: { product_id: product.id },
    defaults: body,
  });

  if (details) await details.update(body);

  return getProductByIdService(product.id);
};

/* ===================== DELETE ===================== */
export const deleteProductService = async (id) => {
  await ProductDetail.destroy({ where: { product_id: id } });
  await Product.destroy({ where: { id } });
  return true;
};

/* ===================== SEARCH ===================== */
export const searchProductsService = async (query) => {
  if (!query) return [];

  const products = await Product.findAll({
    where: {
      is_deleted: false,
      status: "active",
      [Op.or]: [
        { name: { [Op.iLike]: `%${query}%` } },
        { description: { [Op.iLike]: `%${query}%` } },
        { subcategory: { [Op.iLike]: `%${query}%` } },
        { name_ar: { [Op.iLike]: `%${query}%` } },
        { description_ar: { [Op.iLike]: `%${query}%` } },
        { subcategory_ar: { [Op.iLike]: `%${query}%` } },
      ],
    },
    include: [
      { model: Brand, as: "brand" },
      { model: Category, as: "category" },
      { model: ProductDetail, as: "details" },
    ],
    limit: 50,
  });

  return products.map((p) => {
    const plain = p.get({ plain: true });
    const detailsArray = normalizeDetailsArray(plain.details);

    return {
      ...plain,
      category_name: plain.category?.name || "-",
      brand_name: plain.brand?.name || "-",
      key_features: parseJSONSafe(plain.key_features),
      key_features_ar: parseJSONSafe(plain.key_features_ar),
      image_urls: parseJSONSafe(plain.image_urls),
      name_ar: plain.name_ar || plain.name,
      description_ar: plain.description_ar || plain.description,
      subcategory_ar: plain.subcategory_ar || plain.subcategory,
      details: detailsArray.map((d) => ({
        ...d,
        feature_ar: d.feature_ar || d.feature,
        note_ar: d.note_ar || d.note,
      })),
    };
  });
};
