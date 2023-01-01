import express from "express";

let router = express.Router();


router.get('/', (req, res, next) => {
    let categoryController = require('../controllers/categoryControllers');
    categoryController
        .getAll()
        .then(data => {
            res.locals.categories = data;
            let productController = require("../controllers/productControllers")
            return productController.getAll();
        })
        .then(data => {
            res.locals.products = data;
            return res.render('category.ejs')
        })
        .catch(error => next(error));
})

module.exports = router;