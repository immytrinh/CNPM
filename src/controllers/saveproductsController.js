import db from '../models'
let controller = {}
let SaveProduct = db.SaveProduct
let Product = db.Product

controller.getAllSaveProducts = (userId) =>
{
	return new Promise((resolve, reject) =>
	{
		SaveProduct
			.findAll({
				attributes: ['userId', 'productId'],
				include: [{
					model: Product,
					required: true
				}],
				where: { userId: userId }
			})
			.then(data => resolve(data))
			.catch(error => reject(new Error(error)))
	})
}

controller.getOneSaveProduct = async (data) =>
{
	return await SaveProduct.findOne({
		where: { userId: data.userId, productId: data.productId }
	});
}

controller.createSaveProduct = (data) =>
{
	return SaveProduct.create({
		userId: data.userId,
		productId: data.productId
	})
}

controller.deleteSaveProduct = async (data) =>
{
	return new Promise((resolve, reject) =>
	{
		SaveProduct.destroy({
			where: {
				userId: data.userId,
				productId: data.productId
			}
		})
			.then((data) => resolve(data))
	})
}

module.exports = controller