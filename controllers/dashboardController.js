// controllers/dashboardController.js
import { Order, User, Product, Payment, sequelize } from "../models/index.js";
import { Op } from "sequelize";

/**
 * Get dashboard statistics
 * @route GET /api/v1/dashboard/stats
 */
export const getStats = async (req, res) => {
    try {
        // Total orders count
        const totalOrders = await Order.count();

        // Total revenue (sum of all completed orders)
        const revenueResult = await Order.findOne({
            attributes: [[sequelize.fn("SUM", sequelize.col("total_amount")), "total"]],
            where: {
                status: { [Op.in]: ["delivered", "completed"] }
            }
        });
        const totalRevenue = parseFloat(revenueResult?.dataValues?.total || 0);

        // Total customers count
        const totalCustomers = await User.count({
            where: { role: "customer" }
        });

        // Active products count
        const activeProducts = await Product.count({
            where: { status: "active" }
        });

        // Recent orders (last 10)
        const recentOrders = await Order.findAll({
            limit: 10,
            order: [["created_at", "DESC"]],
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: ["id", "name", "email"]
                }
            ],
            attributes: ["id", "total_amount", "status", "created_at"]
        });

        // Monthly sales data (last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const monthlySales = await Order.findAll({
            attributes: [
                [sequelize.fn("DATE_TRUNC", "month", sequelize.col("created_at")), "month"],
                [sequelize.fn("SUM", sequelize.col("total_amount")), "sales"],
                [sequelize.fn("COUNT", sequelize.col("id")), "count"]
            ],
            where: {
                created_at: { [Op.gte]: sixMonthsAgo },
                status: { [Op.in]: ["delivered", "completed"] }
            },
            group: [sequelize.fn("DATE_TRUNC", "month", sequelize.col("created_at"))],
            order: [[sequelize.fn("DATE_TRUNC", "month", sequelize.col("created_at")), "ASC"]],
            raw: true
        });

        // Format monthly sales data
        const formattedMonthlySales = monthlySales.map(item => ({
            month: new Date(item.month).toLocaleDateString("en-US", { month: "short" }),
            sales: parseFloat(item.sales || 0),
            count: parseInt(item.count || 0)
        }));

        res.status(200).json({
            success: true,
            data: {
                totalOrders,
                totalRevenue: totalRevenue.toFixed(2),
                totalCustomers,
                activeProducts,
                recentOrders,
                monthlySales: formattedMonthlySales
            }
        });
    } catch (error) {
        console.error("Dashboard stats error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch dashboard statistics",
            error: error.message
        });
    }
};
