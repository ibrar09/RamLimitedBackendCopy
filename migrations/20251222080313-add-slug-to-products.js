'use strict';

export async function up(queryInterface, Sequelize) {
  await queryInterface.changeColumn('products', 'slug', {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.changeColumn('products', 'slug', {
    type: Sequelize.STRING,
    allowNull: true,
  });
}
