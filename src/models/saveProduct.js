'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class SaveProduct extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.belongsTo(models.Product, { foreignKey: 'productId' });
        }
    };
    SaveProduct.init({
        userId: { type: DataTypes.INTEGER, primaryKey: true },
        productId: { type: DataTypes.INTEGER, primaryKey: true }
    }, {
        sequelize,
        modelName: 'SaveProduct',
        timestamps: false,
    });
    return SaveProduct;
};