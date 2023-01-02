import db from '../models'
let controller = {}
let Category = db.Category
let Product = db.Product
controller.getAll = (query) => {
    return new Promise((resolve, reject) => {
        let options = {
            attributes: ['categoryId', 'name'],
            include: [{
                model: Product,
                where: {}
            }]
        };

        if (query && query.search != '') {
            options.include[0].where.name = {
                [Op.iLike]: `%${query.search}`
            }
        }

        Category
            .findAll(options)
            .then(data => {
                // console.log(data[0].categoryId);
                resolve(data)
            })
            .catch(error => reject(new Error(error)))
    })
}

module.exports = controller;