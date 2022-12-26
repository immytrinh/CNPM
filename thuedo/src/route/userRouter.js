import express from "express";

let router = express.Router();


router.get("/login", (req, res) => {
    res.render('logIn.ejs')
})
router.get("/signup", (req, res) => {
    res.render('signUp.ejs')
})


module.exports = router;