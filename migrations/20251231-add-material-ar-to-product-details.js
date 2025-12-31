'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('product_details', 'material_ar', {
      // Removed: material_ar column is no longer required
      // await queryInterface.addColumn('product_details', 'material_ar', {
      //   type: Sequelize.TEXT,
      //   allowNull: true,
      // });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('product_details', 'material_ar');
      // Removed: material_ar column is no longer required
      // await queryInterface.removeColumn('product_details', 'material_ar');
  }
};
