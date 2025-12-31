'use strict';

export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn('products', 'is_deleted', {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.removeColumn('products', 'is_deleted');
}
