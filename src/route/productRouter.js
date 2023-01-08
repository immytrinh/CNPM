import express from "express";
import { rmSync } from "fs";

let router = express.Router();



router.get('/', (req, res, next) =>
{
    if ((req.query.category === null) || isNaN(req.query.category)) {
        req.query.category = 0;
    }
    if (req.query.search == null || (req.query.search.trim() == '')) {
        req.query.search = '';
    }
    let categoryController = require('../controllers/categoryControllers');
    categoryController
        .getAll()
        .then(data =>
        {
            res.locals.categories = data;
            let productController = require("../controllers/productControllers")
            return productController.getAll(req.query);
        })
        .then(data =>
        {
            res.locals.products = data;
            return res.render('category.ejs')
        })
        .catch(error => next(error));
})

router.get('/:productID', function (req, res, next)
{
    let productController = require("../controllers/productControllers")
    productController
        .getProductById(req.params.productID)
        .then(data =>
        {
            res.locals.product = data;
            return res.render('product-detail.ejs')
        })
});

router.post('/place-order', (req, res, next) =>
{
    if (req.session.user == null)
        res.redirect('/user/login')
    
    let date1 = new Date(req.body["start-date"]);
    let date2 = new Date(req.body["end-date"]);
    let diffDays = date2.getDate() - date1.getDate();
    
    let order = {
        productId: req.body["productId"],
        totalPrice: req.body["price"] * req.body["quantity"] * diffDays,
        start_date: req.body["start-date"],
        end_date: req.body["end-date"],
        quantity: req.body["quantity"]
    }
    

    res.render('place-order.ejs', { orderInfo: order })
})

router.post('/place-order/success', (req, res, next) =>
{
    if (req.session.user == null)
        res.redirect('/user/login')
    let orderInfo = {
        orderId: Math.floor(Math.random() * 2147483647),
        userId: req.session.user.id,
        productId: req.body["productId"],
        totalPrice: req.body["totalPrice"],
        start_date: req.body["start-date"] + " 00:00:00",
        end_date: req.body["end-date"] + " 23:59:59",
        quantity: req.body["quantity"],
        address: req.body["street"] + ", " + req.body["calc_shipping_district"] + ", "  + req.body["calc_shipping_provinces"],
        status: "Chờ xác nhận"
    }

    let orderController = require("../controllers/orderControllers")
    orderController
        .createOrder(orderInfo)
        .then(() => res.send(orderInfo))
})

module.exports = router;