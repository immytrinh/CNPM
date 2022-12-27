import express from "express";
import userControllers from "../controllers/userControllers"
let router = express.Router();


router.get("/login", (req, res) => {
    res.render('logIn.ejs')
})

router.post("/login", (req, res, next) => {
    let email = req.body.email
    let password = req.body.password
    let keepLoggedIn = (req.body.keepLoggedIn != undefined)

    userControllers.getUserByEmail(email)
        .then(user => {
            if (user) {
                if (userControllers.comparePassword(password, user.password)) {
                    // duy tri dang nhap
                    req.session.cookie.maxAge = keepLoggedIn ? 30 * 24 * 60 * 60 * 1000 : null
                    // bật trạng thái lên
                    req.session.user = user;
                    res.redirect("/")
                } else {
                    // không trùng mật khẩu
                    res.render("logIn.ejs", {
                        message: "Mật khẩu sai!",
                        type: "alert-danger"
                    })

                }
            } else {
                res.render("login", {
                    message: "Email không tồn tại!",
                    type: "alert-danger"
                })
            }

        })
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
                    message: `Email ${email} đã tồn tại!`,
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

router.get("/logout", (req, res, next) => {
    req.session.destroy(error => {
        if (error) {
            return next(error);
        }
        return res.redirect("/user/login")
    })
})

module.exports = router;