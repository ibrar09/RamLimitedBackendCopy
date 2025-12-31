import { DataTypes } from "sequelize";

export default (sequelize) => {
  const QuotationFile = sequelize.define(
    "QuotationFile",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      quotation_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "quotations",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      file_path: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      file_name: {
        type: DataTypes.STRING,
      },
      file_type: {
        type: DataTypes.STRING,
      },
    },
    {
      tableName: "quotation_files",
      timestamps: true,
      underscored: true,
    }
  );

  return QuotationFile;
};
