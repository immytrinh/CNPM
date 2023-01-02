import db from '../models'
let controller = {}
let Product = db.Product

controller.getAll = () =>
{
    return new Promise((resolve, reject) =>
    {
        Product
            .findAll({
                // include: [{ db: db.Category }],
                attributes: ['productId', 'name', 'price', 'imagePath', 'description']
            })
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

module.exports = controller;