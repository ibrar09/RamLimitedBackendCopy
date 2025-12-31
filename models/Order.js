import { DataTypes } from "sequelize";
import { underscoredIf } from "sequelize/lib/utils";

export default (sequelize) => {
  const Order = sequelize.define(
    "Order",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      address_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'user_addresses',
          key: 'id'
        }
      },
      order_number: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      subtotal: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00,
        validate: {
          min: 0
        }
      },
      tax: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00,
        validate: {
          min: 0
        }
      },
      shipping: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00,
        validate: {
          min: 0
        }
      },
      total: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00,
        validate: {
          min: 0
        }
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: "pending"
      },
      payment_status: {
        type: DataTypes.STRING,
        defaultValue: "unpaid"
      },
      payment_method: {
        type: DataTypes.STRING,
        allowNull: false
      },

      // ------------------------------------------------------
      // 🔥 Added fields for Tap Payments
      // ------------------------------------------------------

      tap_charge_id: {
        type: DataTypes.STRING, // Stores chg_xxx
        allowNull: true
      },

      tap_payment_response: {
        type: DataTypes.JSONB, // Stores full TAP response JSON
        allowNull: true
      },

      // ------------------------------------------------------

      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "orders",
      timestamps: true,
      underscored: true,
      hooks: {
        beforeValidate: (order) => {
          if (!order.order_number) {
            order.order_number = `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
            console.log("🆔 Generated order_number:", order.order_number);
          }
        }
      }
    }
  );

  return Order;
};
