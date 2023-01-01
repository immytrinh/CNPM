import db from '../models'
let controller = {}
let Product = db.Product

controller.getAll = () => {
    return new Promise((resolve, reject) => {
        Product
            .findAll({
                // include: [{ db: db.Category }],
                attributes: ['productId', 'name', 'price', 'imagePath', 'description']
            })
            .then(data => resolve(data))
            .catch(error => reject(new Error(error)))
    })
}

module.exports = controller;