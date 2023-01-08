// import { UPSERT } from 'sequelize/types/query-types'
import db from '../models'
let controller = {}
let Product = db.Product
let Category = db.Category
let Order = db.Order
let User = db.User
const Sequelize = require('sequelize');
const Op = Sequelize.Op;


controller.getAll = (query) =>
{
    return new Promise((resolve, reject) =>
    {
        let options = {
            include: [{ model: Category }],
            attributes: ['productId', 'name', 'categoryId', 'price', 'imagePath', 'description'],
            where: {}
        }
        if (query.search != '') {
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

controller.getProductById = (id) =>
{
    return new Promise((resolve, reject) =>
    {
        Product
            .findAll({
                attributes: ['productId', 'name', 'price', 'imagePath', 'description'],
                where: { productID: id }
            })
            .then(data => resolve(data[0].dataValues))
            .catch(error => reject(new Error(error)))
    })
}

controller.getPlacedOrder = (id) =>{
    return new Promise((resolve, reject) => {
        let options = {
            where: {
                ownerId: id,
            },
            include: [{
                model: Order,
                required: true,
                include: [{
                    model: User,
                    required: true,
                }]
            }],
        }
        Product
            .findAll(options)
            .then(data => {
                resolve(data)
            })
            .catch(error => reject(new Error(error)))
    });
}

module.exports = controller;