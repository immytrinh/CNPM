import db from '../models'
let controller = {}
let Product = db.Product
let Category = db.Category
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

controller.getAll = (query) => {
    return new Promise((resolve, reject) => {
        let options = {
            include: [{ model: Category }],
            attributes: ['productId', 'name','categoryId', 'price', 'imagePath', 'description'],
            where: {}
        }
        if(query.search != ''){
            console.log(query.search)
            options.where.name = {
                [Op.like]: `%${query.search}%`
            }
        }

        if (query.category) {
            options.where.categoryId = query.category;
        }
        Product
            .findAll(options)
            .then(data => resolve(data))
            .catch(error => reject(new Error(error)))
    })
}

module.exports = controller;