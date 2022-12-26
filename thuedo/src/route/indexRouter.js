import express from "express";

let router = express.Router();

router.get("/", async (req, res) => {
    res.render('index.ejs')
})

module.exports = router;