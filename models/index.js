// backend/models/index.js
import { Sequelize } from "sequelize";
import config from "../config/config.js";

// ------------------ Import Models ------------------ //
import UserModel from "./User.js";
import UserAddressModel from "./UserAddress.js";
import CategoryModel from "./Category.js";
import BrandModel from "./Brand.js";
import ProductModel from "./Product.js";
import ProductImageModel from "./ProductImage.js";
import ProductKeyFeatureModel from "./ProductKeyFeature.js";
import ProductVariantModel from "./ProductVariant.js";
import WishlistModel from "./Wishlist.js";
import OrderModel from "./Order.js";
import OrderItemModel from "./OrderItem.js";
import PaymentModel from "./Payment.js";
import ShipmentModel from "./Shipment.js";
import CouponModel from "./Coupon.js";
import PromoCodeModel from "./PromoCode.js";
import ContactModel from "./Contact.js";
import SupportTicketModel from "./SupportTicket.js";
import ProductDetailModel from "./ProductDetail.js";
import SubcategoryModel from "./subcategory.js";
import SubcategoryItemModel from "./subcategoryItem.js";
import BannerModel from "./Banner.js";
import QuotationModel from "./Quotation.js";
import QuotationFileModel from "./QuotationFile.js";
import ProductReviewModel from "./ProductReview.js";
import CartItemModel from "./CartItems.js"; // ✅ fixed
import CVModel from "./CV.js";
import InvoiceModel from "./invoice.model.js";
// Projects Tables
import ProjectModel from "./Project.js";
import ProjectImageModel from "./ProjectImage.js";
import ProjectChallengeModel from "./ProjectChallenge.js";
import ProjectSolutionModel from "./ProjectSolution.js";
import ProjectTestimonialModel from "./ProjectTestimonial.js";
import ProjectInvestmentModel from "./ProjectInvestment.js";
import InvestmentFeatureModel from "./InvestmentFeature.js";
import ProjectChallengeSolutionModel from "./ProjectChallengeSolution.js";
import InvoiceRequestModel from "./InvoiceRequest.js";
import JobModel from "./Job.js";

// ✅ New OTP & Session Models
import OtpModel from "./Otp.js";
import SessionModel from "./Session.js";

// ------------------ Setup Sequelize ------------------ //
const dbConfig = config.db;

if (!dbConfig) throw new Error(`No database configuration found in config.js`);

const sequelize = dbConfig.url
  ? new Sequelize(dbConfig.url, {
    logging: false,
    timezone: "+03:00",
    dialectOptions: {
      // SSL is often required for cloud databases
      ...(process.env.NODE_ENV === "production" && {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      }),
      useUTC: false,
      dateStrings: true,
      typeCast: true,
    },
    define: {
      timestamps: true,
      underscored: false,
    },
  })
  : new Sequelize(
    dbConfig.database,
    dbConfig.username,
    dbConfig.password,
    {
      host: dbConfig.host,
      dialect: dbConfig.dialect,
      logging: false,
      timezone: "+03:00",
      dialectOptions: {
        useUTC: false,
        dateStrings: true,
        typeCast: true,
      },
      define: {
        timestamps: true,
        underscored: false,
      },
    }
  );

// ------------------ Initialize Models ------------------ //
const User = UserModel(sequelize);
const UserAddress = UserAddressModel(sequelize);
const Category = CategoryModel(sequelize);
const Brand = BrandModel(sequelize);
const Product = ProductModel(sequelize);
const ProductImage = ProductImageModel(sequelize);
const ProductKeyFeature = ProductKeyFeatureModel(sequelize);
const ProductVariant = ProductVariantModel(sequelize);
const Wishlist = WishlistModel(sequelize);
const Order = OrderModel(sequelize);
const OrderItem = OrderItemModel(sequelize);
const Payment = PaymentModel(sequelize);
const Shipment = ShipmentModel(sequelize);
const Coupon = CouponModel(sequelize);
const PromoCode = PromoCodeModel(sequelize);
const Contact = ContactModel(sequelize);
const SupportTicket = SupportTicketModel(sequelize);
const ProductDetail = ProductDetailModel(sequelize);
const Subcategory = SubcategoryModel(sequelize);
const SubcategoryItem = SubcategoryItemModel(sequelize);
const Banner = BannerModel(sequelize);
const ProductReview = ProductReviewModel(sequelize);
const Project = ProjectModel(sequelize);
const ProjectImage = ProjectImageModel(sequelize);
const ProjectChallenge = ProjectChallengeModel(sequelize);
const ProjectSolution = ProjectSolutionModel(sequelize);
const ProjectTestimonial = ProjectTestimonialModel(sequelize);
const ProjectInvestment = ProjectInvestmentModel(sequelize);
const InvestmentFeature = InvestmentFeatureModel(sequelize);
const ProjectChallengeSolution = ProjectChallengeSolutionModel(sequelize);
const Quotation = QuotationModel(sequelize);
const QuotationFile = QuotationFileModel(sequelize);
const Otp = OtpModel(sequelize);
const Session = SessionModel(sequelize);
const CartItem = CartItemModel(sequelize); // ✅ singular
const CV = CVModel(sequelize)
const Invoice = InvoiceModel(sequelize);
const InvoiceRequest = InvoiceRequestModel(sequelize)
const Job = JobModel(sequelize);


console.log("✅ All models initialized successfully");

// ------------------ Associations ------------------ //

// User ↔ Address
User.hasMany(UserAddress, { foreignKey: "user_id", onDelete: "CASCADE" });
UserAddress.belongsTo(User, { foreignKey: "user_id" });

// Product ↔ Category/Brand
Product.belongsTo(Category, { foreignKey: "category_id", as: "category" });
Product.belongsTo(Brand, { foreignKey: "brand_id", as: "brand" });
Category.hasMany(Product, { foreignKey: "category_id", as: "products" });
Brand.hasMany(Product, { foreignKey: "brand_id", as: "products" });

// Product ↔ Images
Product.hasMany(ProductImage, { foreignKey: "product_id", as: "images", onDelete: "CASCADE" });
ProductImage.belongsTo(Product, { foreignKey: "product_id", as: "product" });

// Product ↔ Key Features
Product.hasMany(ProductKeyFeature, { foreignKey: "product_id", onDelete: "CASCADE" });
ProductKeyFeature.belongsTo(Product, { foreignKey: "product_id" });

// Product ↔ Variants
Product.hasMany(ProductVariant, { foreignKey: "product_id", onDelete: "CASCADE" });
ProductVariant.belongsTo(Product, { foreignKey: "product_id" });

// Product ↔ Reviews
Product.hasMany(ProductReview, { foreignKey: "product_id", as: "reviews", onDelete: "CASCADE" });
ProductReview.belongsTo(Product, { foreignKey: "product_id", as: "product" });

// User ↔ Reviews
User.hasMany(ProductReview, { foreignKey: "user_id", as: "reviewsMade" }); // change alias
ProductReview.belongsTo(User, { foreignKey: "user_id", as: "reviewer" }); // must match 'reviewer'

// User ↔ Wishlist ↔ Product
User.hasMany(Wishlist, { foreignKey: "user_id", onDelete: "CASCADE" });
Wishlist.belongsTo(User, { foreignKey: "user_id" });
Product.hasMany(Wishlist, { foreignKey: "product_id", onDelete: "CASCADE" });
Wishlist.belongsTo(Product, { foreignKey: "product_id" });

// User ↔ Orders
User.hasMany(Order, { foreignKey: "user_id", as: "orders" });
Order.belongsTo(User, { foreignKey: "user_id", as: "user" });

// UserAddress ↔ Orders
UserAddress.hasMany(Order, { foreignKey: "address_id", as: "orders" });
Order.belongsTo(UserAddress, { foreignKey: "address_id", as: "address" });

// Orders ↔ OrderItems
Order.hasMany(OrderItem, { foreignKey: "order_id", as: "items", onDelete: "CASCADE" });
OrderItem.belongsTo(Order, { foreignKey: "order_id", as: "order" });

// Product ↔ OrderItems

Product.hasMany(OrderItem, { foreignKey: "product_id", as: "orderItems" });
OrderItem.belongsTo(Product, { foreignKey: "product_id", as: "productDetails" });


// ProductVariant ↔ OrderItems
ProductVariant.hasMany(OrderItem, { foreignKey: "variant_id", as: "orderItems" });
OrderItem.belongsTo(ProductVariant, { foreignKey: "variant_id", as: "variant" });

// Orders ↔ Payments
Order.hasMany(Payment, { foreignKey: "order_id", as: "payments", onDelete: "CASCADE" });
Payment.belongsTo(Order, { foreignKey: "order_id", as: "order" });

// User ↔ Payments
User.hasMany(Payment, {
  foreignKey: "userId",
  as: "payments",
  onDelete: "CASCADE",
});
Payment.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

// Orders ↔ Shipments
Order.hasMany(Shipment, { foreignKey: "order_id", as: "shipments", onDelete: "CASCADE" });
Shipment.belongsTo(Order, { foreignKey: "order_id", as: "order" });

// User ↔ Support Tickets
User.hasMany(SupportTicket, { foreignKey: "user_id", as: "supportTickets" });
SupportTicket.belongsTo(User, { foreignKey: "user_id", as: "user" });

// Product ↔ ProductDetail
Product.hasOne(ProductDetail, { foreignKey: "product_id", as: "details", onDelete: "CASCADE" });
ProductDetail.belongsTo(Product, { foreignKey: "product_id", as: "product" });

// Category ↔ Subcategory ↔ SubcategoryItem
Category.hasMany(Subcategory, { foreignKey: "category_id", as: "subcategories" });
Subcategory.belongsTo(Category, { foreignKey: "category_id", as: "category" });
Subcategory.hasMany(SubcategoryItem, { foreignKey: "subcategory_id", as: "items" });
SubcategoryItem.belongsTo(Subcategory, { foreignKey: "subcategory_id", as: "subcategory" });
// assuming you already import ProductReview and User


// assuming you already import ProductReview and User


// ------------------ Project Associations ------------------ //
// Project, ProjectImage, ProjectChallenge, etc. (keep same as before)
Project.hasMany(ProjectImage, { foreignKey: "project_id", as: "images", onDelete: "CASCADE" });
ProjectImage.belongsTo(Project, { foreignKey: "project_id", as: "project" });
Project.hasMany(ProjectChallenge, { foreignKey: "project_id", as: "challenges", onDelete: "CASCADE" });
ProjectChallenge.belongsTo(Project, { foreignKey: "project_id", as: "project" });
Project.hasMany(ProjectSolution, { foreignKey: "project_id", as: "solutions", onDelete: "CASCADE" });
ProjectSolution.belongsTo(Project, { foreignKey: "project_id", as: "project" });
Project.hasMany(ProjectTestimonial, { foreignKey: "project_id", as: "testimonials", onDelete: "CASCADE" });
ProjectTestimonial.belongsTo(Project, { foreignKey: "project_id", as: "project" });
Project.hasOne(ProjectInvestment, { foreignKey: "project_id", as: "investment", onDelete: "CASCADE" });
ProjectInvestment.belongsTo(Project, { foreignKey: "project_id", as: "project" });
ProjectInvestment.hasMany(InvestmentFeature, { foreignKey: "investment_id", as: "features", onDelete: "CASCADE" });
InvestmentFeature.belongsTo(ProjectInvestment, { foreignKey: "investment_id", as: "investment" });

// Quotation Associations
Quotation.hasMany(QuotationFile, { foreignKey: "quotation_id", as: "files", onDelete: "CASCADE" });
QuotationFile.belongsTo(Quotation, { foreignKey: "quotation_id", as: "quotation" });
Quotation.belongsTo(User, { foreignKey: "user_id", as: "user" });
User.hasMany(Quotation, { foreignKey: "user_id", as: "quotations" });

// OTP & Session
User.hasMany(Otp, { foreignKey: "user_id", onDelete: "CASCADE" });
Otp.belongsTo(User, { foreignKey: "user_id" });
User.hasMany(Session, { foreignKey: "user_id", onDelete: "CASCADE" });
Session.belongsTo(User, { foreignKey: "user_id" });

// Jobs & CVs
Job.hasMany(CV, { foreignKey: "job_id", as: "applications" });
CV.belongsTo(Job, { foreignKey: "job_id", as: "job" });

// ------------------ CartItem Associations ------------------ //
CartItem.belongsTo(Product, { foreignKey: "product_id" });
CartItem.belongsTo(ProductVariant, { foreignKey: "variant_id" });
CartItem.belongsTo(User, { foreignKey: "user_id" });

Product.hasMany(CartItem, { foreignKey: "product_id" });
ProductVariant.hasMany(CartItem, { foreignKey: "variant_id" });
User.hasMany(CartItem, { foreignKey: "user_id" });

Shipment.belongsTo(Order, {
  foreignKey: "order_id",
  as: "shipment_order",
});


Order.hasOne(Shipment, {
  foreignKey: "order_id",
  as: "shipment",
});


// USER → SHIPMENTS
User.hasMany(Shipment, {
  foreignKey: "user_id",
  as: "shipments",
});

Shipment.belongsTo(User, {
  foreignKey: "user_id",
  as: "shipment_user",
});


// models/index.js
CartItem.belongsTo(Product, { foreignKey: "product_id", as: "product" });
Product.hasMany(CartItem, { foreignKey: "product_id", as: "cartItems" });


CartItem.belongsTo(ProductVariant, { foreignKey: "variant_id", as: "variant" });
ProductVariant.hasMany(CartItem, { foreignKey: "variant_id", as: "cartItems" });

CartItem.belongsTo(User, { foreignKey: "user_id", as: "user" });
User.hasMany(CartItem, { foreignKey: "user_id", as: "cartItems" });

Order.belongsTo(UserAddress, { as: "shippingAddress", foreignKey: "address_id" });
UserAddress.hasMany(Order, { foreignKey: "address_id" });
Invoice.belongsTo(Order, { foreignKey: "orderId" });
Invoice.belongsTo(User, { foreignKey: "userId" });



Order.hasOne(Invoice, { foreignKey: "orderId", as: "invoice" });
Invoice.belongsTo(Order, { foreignKey: "orderId", as: "order" });


// models/index.js or separate file
InvoiceRequest.belongsTo(User, { foreignKey: "userId" });
InvoiceRequest.belongsTo(Order, { foreignKey: "orderId" });

// Order hasMany OrderItem








// Order -> Address
// Order.belongsTo(Address, { foreignKey: "address_id", as: "address" });


// ------------------ Connect Function ------------------ //
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("PostgreSQL connected successfully!");
    await sequelize.sync({ alter: true }); // Don't drop tables
    console.log("✅ All tables synchronized successfully");
  } catch (error) {
    console.error("Unable to connect to DB:", error);
  }
};

// await sequelize.sync({ alter: true }); // Use { force: true } only in dev
// console.log("✅ Product table synced successfully!");

// ------------------ Export all ------------------ //
export {
  sequelize,
  connectDB,
  User,
  UserAddress,
  Category,
  Brand,
  Product,
  ProductImage,
  ProductKeyFeature,
  ProductVariant,
  Wishlist,
  Order,
  OrderItem,
  Payment,
  Shipment,
  Coupon,
  PromoCode,
  Contact,
  SupportTicket,
  ProductDetail,
  ProductReview,
  Subcategory,
  SubcategoryItem,
  Banner,
  Project,
  ProjectImage,
  ProjectChallenge,
  ProjectSolution,
  ProjectTestimonial,
  ProjectInvestment,
  InvestmentFeature,
  ProjectChallengeSolution,
  Quotation,
  QuotationFile,
  Otp,
  Session,
  CartItem, // ✅ singular
  CV,
  Invoice,
  InvoiceRequest,
  Job,
};
