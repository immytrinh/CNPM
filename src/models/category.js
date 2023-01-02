'use strict';
const {
    Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Category extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate({ Product }) {
            // define association here
            this.hasMany(Product, {
                foreignKey: 'categoryId',
                onDelete: 'CASCADE'
            });
        }
    };
    Category.init({
        categoryId: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        name: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'Category',
        timestamps: false,
    });
    return Category;
};