import express from "express";

let router = express.Router();

router.get("/", (req, res) => {
    return res.render('index')
})

router.get("/:id", (req, res) => {
    return res.render("single-product")
})

module.exports = router;