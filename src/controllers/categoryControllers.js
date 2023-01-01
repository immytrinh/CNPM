import db from '../models'
let controller = {}
let Category = db.Category

controller.getAll = () => {
    return new Promise((resolve, reject) => {
        Category
            .findAll({
                attributes: ['categoryId', 'name'],
                // include: [{ model: db.Products }]
            })
            .then(data => resolve(data))
            .catch(error => reject(new Error(error)))
    })
}

module.exports = controller;