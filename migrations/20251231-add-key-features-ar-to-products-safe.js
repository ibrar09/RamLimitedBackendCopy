'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Only add the column if it doesn't exist
    const table = await queryInterface.describeTable('products');
    if (!table.key_features_ar) {
      await queryInterface.addColumn('products', 'key_features_ar', {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: [],
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Only remove the column if it exists
    const table = await queryInterface.describeTable('products');
    if (table.key_features_ar) {
      await queryInterface.removeColumn('products', 'key_features_ar');
    }
  }
};
