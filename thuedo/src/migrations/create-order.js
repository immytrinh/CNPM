'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('order', {
            orderId: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            userId: {
                type: Sequelize.INTEGER
            },
            productId: {
                type: Sequelize.INTEGER
            },
            totalPrice: {
                type: Sequelize.FLOAT
            },
            startTime: {
                allowNull: false,
                type: Sequelize.DATE
            },
            endTime: {
                allowNull: false,
                type: Sequelize.DATE
            },
            quantity: {
                type: Sequelize.INTEGER
            },
            status: {
                type: Sequelize.STRING
            },
            address: {
                type: Sequelize.STRING
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('order');
    }
};