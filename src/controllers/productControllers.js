import db from '../models'
let controller = {}
let Product = db.Product

controller.getAll = (query) => {
    return new Promise((resolve, reject) => {
        let options = {
            include: [{ db: db.Category }],
            attributes: ['productId', 'name','categoryId', 'price', 'imagePath', 'description'],
            where: {}
        }
        if(query.search != ''){
            options.where.name = {
                [Op.iLike]: `%${query.search}`
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