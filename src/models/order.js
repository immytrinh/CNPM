'use strict';
const {
    Model
} = require('sequelize');
// const { FOREIGNKEYS } = require('sequelize/types/query-types');

module.exports = (sequelize, DataTypes) => {
    class Order extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.belongsTo(models.User, {
                foreignKey: 'userId',
                targetKey: 'id',
            })
            this.belongsTo(models.Product, {
                foreignKey: 'productId',
            });
        }
    };
    Order.init({
        orderId: { type: DataTypes.INTEGER , primaryKey: true },
        userId: DataTypes.INTEGER,
        productId: DataTypes.INTEGER,
        totalPrice: DataTypes.FLOAT,
        startTime: DataTypes.DATE,
        endTime: DataTypes.DATE,
        quantity: DataTypes.INTEGER,
        status: DataTypes.STRING,
        address: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'Order',
        freezeTableName: true,
    });
    return Order;
};