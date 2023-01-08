import { name } from "ejs";
import db, { sequelize } from '../models'
import express from "express";
import userControllers from "../controllers/userControllers"
import category from "../models/category";
let router = express.Router();


router.get("/login", (req, res) => {
    req.session.returnURL = req.query.returnURL;
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
                    if (req.session.returnURL) {
                        res.redirect(req.session.returnURL)
                    } else {
                        res.redirect("/");
                    }
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
            console.log(user)
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


router.get("/forgot", (req, res, next) => {
    res.render('forgot.ejs', {
        message: "Nhập email của bạn, chúng tôi sẽ gửi cho bạn hướng dẫn."
    })
})

router.post('/forgot', (req, res, next) => {
    let email = req.body.email

    // Kiểm tra email có tồn tại không?
    userControllers.getUserByEmail(email)
        .then(user => {
            if (user) {
                // Nếu có thì tạo link
                let token = userControllers.createJWT(email);
                let host = req.header('host');
                let url = `${req.protocol}://${host}/user/reset?u=${email}&t=${token}`;

                // Gửi email
                userControllers.sendResetPassword(user, host, url)
                    .then((result) => {
                        // Nếu gửi email thành công
                        res.render("forgot", {
                            done: 1,
                            email
                        })

                    })
                    .catch((err) => {
                        return res.render("forgot.ejs", {
                            message: 'Lỗi xảy ra khi cố gắng gửi đến mail của bạn. Hãy thử lại!',
                            type: 'alert-danger',
                            email
                        })
                    })

            } else {
                // Ngược lại, nếu email không tồn tại
                return res.render("forgot.ejs", {
                    message: `Email chưa được đăng ký! Sử dụng email khác hoặc <a href="/user/signup"> Đăng ký </a>`,
                    type: 'alert-danger',
                    email
                })
            }

        })
        .catch(error => next(error))
})

router.get('/reset', (req, res, next) => {
    // trước khi hiển thị form, ta lấy token và username
    let email = req.query.u;
    let token = req.query.t;
    if (!email || !token) {
        return res.redirect('/user/forgot');
    }
    let isVerify = userControllers.verifyJWT(token);

    if (isVerify) {
        res.render('reset.ejs', { email, message: "Hãy nhập mật khẩu mới!" })
    }
    else { // link đã hết hạn.
        return res.render('forgot.ejs', {
            message: "Link xác thực đã hết hạn. Hãy nhập lại email của bạn, chúng tôi sẽ gửi cho bạn hướng dẫn!"
        })
    }
})

router.post('/reset', (req, res, next) => {
    let email = req.body.email;
    let password = req.body.password;
    let confirmedPassword = req.body.confirmedPassword;

    if (password !== confirmedPassword) {
        return res.render('reset', {
            email,
            message: 'Mật khẩu không khớp',
            type: 'alert-danger'
        })
    }
    console.log("Emaillllll:", email)
    userControllers.getUserByEmail(email)
        .then(user => {
            if (user) {
                console.log("da tim thay")
                user.password = password,
                    userControllers.updatePassword(user),
                    res.render('reset.ejs', {
                        done: 1
                    })
            } else {
                res.redirect('/user/forgot')
            }
        })
})

router.get('/add-product', (req, res, next) => {

    if (req.session.user != null){
        let categoryController = require('../controllers/categoryControllers');
        categoryController
            .getAll()
            .then(data => {
                res.locals.categories = data;
                return res.render("new-product");
            });
    }
    else{
        return res.render("logIn.ejs");
    }
});

const multer = require('multer')
var storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, './uploads/images/')     // './public/images/' directory name where save the file
    },
    filename: (req, file, callBack) => {
        console.log(file)
        callBack(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})
 
const path = require('path');
var upload = multer({
    storage: storage
});

router.post('/add-product', upload.single('image'), (req, res, next) => {
    let filepath = req.file.path;
    filepath = path.join("../../", filepath)
    
    var path2 = filepath.replace(/\\/g, "/");
    console.log(path2);
    console.log(filepath)
    console.log(req.body.category)
    const product = {
        name : req.body.title,
        price: req.body.price,
        description: req.body.description,
        imagePath: path2,
        ownerId: req.session.user.id,
        categoryId: req.body.category,
        availability: req.body.quantity,
    };
    let categoryController = require('../controllers/categoryControllers');
    if(userControllers.addProduct(product)){
        categoryController
            .getAll()
            .then(data => {
                res.locals.categories = data;
                return res.render('new-product.ejs', {message: 'success'});
            })
    }
    else{categoryController
        .getAll()
        .then(data => {
            res.locals.categories = data;
            return res.render('new-product.ejs', {message: 'error'});
        })
    }
});

router.get('/orders-manager', (req,res,next) => {
    
    let productController = require('../controllers/productControllers');
    let userControllers = require('../controllers/userControllers');
    
    // console.log(req.session.user);
    // if(req.session.user == null){
    //     return res.redirect('login');
    // }

    // let ownerId = req.session.user.id;
    // let orders = productController.getPlacedOrder(ownerId);
    productController.getPlacedOrder(1)
        .then(data => {
            res.locals.orders = data;
            // console.log(data);
            return res.render('orders-manager');
        });


});

module.exports = router;