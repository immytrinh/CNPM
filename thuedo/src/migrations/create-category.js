'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('categories', {
            // userId: DataTypes.INTEGER,
            // productId: DataTypes.INTEGER,
            // totalPrice: DataTypes.FLOAT,
            // startTime: DataTypes.DATE,
            // endTime: DataTypes.DATE,
            // quantity: DataTypes.INTEGER,
            // status: DataTypes.STRING,
            // address: DataTypes.STRING
            categoryId: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            name: {
                type: Sequelize.STRING
            }
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('categories');
    }
};