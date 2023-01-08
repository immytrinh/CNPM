'use strict';

const { FOREIGNKEYS } = require("sequelize/types/query-types");

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('products', {
            productId: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            name: {
                type: Sequelize.STRING
            },
            owner: {
                type: Sequelize.STRING,
                references: {
                    model: 'users',
                    key: 'id',
                }
            },
            price: {
                type: Sequelize.FLOAT
            },
            categoryId: {
                type: Sequelize.STRING
            },
            availability: {
                type: Sequelize.BOOLEAN
            },
            description: {
                type: Sequelize.STRING
            },
            imagePath: {
                type: Sequelize.STRING
            },
            createdAt: {
                allowNull: true,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: true,
                type: Sequelize.DATE
            }
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('products');
    }
};