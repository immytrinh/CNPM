import express from "express";

let router = express.Router();


router.get('/', (req, res, next) => {
    if ((req.query.category === null) || isNaN(req.query.category)) {
        req.query.category = 0;
    }

    if (req.query.search == null || (req.query.search.trim() == '')) {
        req.query.search = '';
    }

    let categoryController = require('../controllers/categoryControllers');
    categoryController
        .getAll()
        .then(data => {
            res.locals.categories = data;
            let productController = require("../controllers/productControllers")
            return productController.getAll(req.query);
        })
        .then(data => {
            res.locals.products = data;
            return res.render('category.ejs')
        })
        .catch(error => next(error));
})

module.exports = router;