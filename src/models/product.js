'use strict';
const {
    Model
} = require('sequelize');
const Category = require('./category');
module.exports = (sequelize, DataTypes) => {
    class Product extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            this.belongsTo(models.Category, {foreignKey: 'categoryId'})
        }
    };
    Product.init({
        productId: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        name: DataTypes.STRING,
        price: DataTypes.FLOAT,
        categoryId: DataTypes.STRING,
        availability: DataTypes.BOOLEAN,
        description: DataTypes.STRING,
        imagePath: DataTypes.STRING,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
    }, { 
        timestamps: false,
        sequelize,
        modelName: 'Product',
    });
    return Product;
};