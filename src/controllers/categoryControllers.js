import db from '../models'
let controller = {}
let Category = db.Category
let Product = db.Product
controller.getAll = () => {
    return new Promise((resolve, reject) => {
        Category
            .findAll({
                attributes: ['categoryId', 'name'],
                // include: [{ model: Product }]
            })
            .then(data => {
                // console.log(data[0].categoryId);
                resolve(data)
            })
            .catch(error => reject(new Error(error)))
    })
}

module.exports = controller;