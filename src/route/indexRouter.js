import express from "express";

let router = express.Router();

router.get("/", (req, res, next) => {
    // let categoryController = require("../controllers/categoryControllers");
    // categoryController
    //     .getAll()
    //     .then(data => {
    //         res.locals.categories = data;
    //         res.render("index")
    //     })
    //     .catch(error => next(error));
    res.redirect('/products')
})

module.exports = router;