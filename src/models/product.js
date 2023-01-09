'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Product extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.belongsTo(models.Category, { foreignKey: 'categoryId' });
            this.belongsTo(models.User, {foreignKey: 'ownerId'});
            this.hasMany(models.Order, { foreignKey: 'productId' })
            this.hasMany(models.SaveProduct, { foreignKey: 'productId' })

        }
    };
    Product.init({
        productId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: DataTypes.STRING,
        ownerId:{ 
            type: DataTypes.STRING
        },
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