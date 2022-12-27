import express from "express";
import userControllers from "../controllers/userControllers"
let router = express.Router();


router.get("/login", (req, res) => {
    res.render('logIn.ejs')
})
router.get("/signup", (req, res) => {
    res.render('signUp.ejs')
})

router.post("/signup", (req, res, next) => {
    let email = req.body.email
    let password = req.body.password
    let confirmedPassword = req.body.confirmedPassword

    // Check password and confirmPassword are similar.
    if (password !== confirmedPassword) {
        return res.render("signUp.ejs", {
            message: 'Mật khẩu không khớp!',
            type: 'alert-danger'
        })
    }
    // check username is existed in DB
    userControllers
        .getUserByEmail(email)
        .then(user => {
            if (user) {
                return res.render('signUp.ejs', {
                    message: `Email ${email} đã tồn tại. Sử dụng tài khoản email khác!`,
                    type: 'alert-danger'
                })
            }
            // Create new account
            user = {
                email: email,
                password
            }
            return userControllers.createUser(user)
                .then(user => {
                    res.render('logIn.ejs', {
                        message: "Đăng ký tài khoản thành công, hãy đăng nhập!",
                        type: 'alert-primary'
                    })
                })
        })
        .catch(error => next(error))


})
module.exports = router;