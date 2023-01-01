'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('SaveProducts', {
            userId: {
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            productId: {
                primaryKey: true,
                type: Sequelize.INTEGER
            }
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('SaveProducts');
    }
};