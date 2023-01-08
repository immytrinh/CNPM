import db from '../models'
let controller = {}
let Order = db.Order
const Sequelize = require('sequelize');

// Override timezone formatting for MSSQL
Sequelize.DATE.prototype._stringify = function _stringify(date, options)
{
	return this._applyTimezone(date, options).format('YYYY-MM-DD HH:mm:ss.SSS');
};

controller.createOrder = (orderInfo) =>
{
	return Order.create({
		orderId: orderInfo.orderId,
		userId: orderInfo.userId,
		productId: orderInfo.productId,
		totalPrice: orderInfo.totalPrice,
		startTime: orderInfo.start_date,
		endTime: orderInfo.end_date,
		quantity: orderInfo.quantity,
		address: orderInfo.address,
		status: orderInfo.status
	})
}


module.exports = controller;