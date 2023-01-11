import { name } from "ejs";
import db, { sequelize } from '../models'
import express from "express";
import userControllers from "../controllers/userControllers"
import category from "../models/category";
let router = express.Router();

function getSaveProduct(req,res)
{
    return new Promise((resolve, reject) =>
    {
        if (res.locals.isLoggedIn) {
            let saveproductsController = require("../controllers/saveproductsController")

            saveproductsController.getAllSaveProducts(req.session.user.id)
                .then(data => { resolve(data) })
        }
        else
            resolve([]);
    })
}

router.get("/login", (req, res) =>
{
    req.session.returnURL = req.query.returnURL;
    getSaveProduct(req,res).then(data => res.render('logIn.ejs', { saveProducts: data }))
})

router.post("/login", (req, res, next) =>
{
    let email = req.body.email
    let password = req.body.password
    let keepLoggedIn = (req.body.keepLoggedIn != undefined)

    userControllers.getUserByEmail(email)
        .then(user =>
        {
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
                    getSaveProduct(req,res).then(data => res.render("logIn.ejs", {
                        message: "Mật khẩu sai!",
                        type: "alert-danger",
                        saveProducts: data
                    }))

                }


            } else {
                getSaveProduct(req,res).then(data => res.render("logIn.ejs", {
                    message: "Email không tồn tại!",
                    type: "alert-danger",
                    saveProducts: data
                }))
            }

        })
})
router.get("/signup", (req, res) =>
{
    getSaveProduct(req,res).then(data => res.render('signUp.ejs', { saveProducts: data }))
})

router.post("/signup", (req, res, next) =>
{
    let email = req.body.email
    let password = req.body.password
    let confirmedPassword = req.body.confirmedPassword

    // Check password and confirmPassword are similar.
    if (password !== confirmedPassword) {
        return getSaveProduct(req,res).then(data => res.render("signUp.ejs", {
            message: 'Mật khẩu không khớp!',
            type: 'alert-danger',
            saveProducts: data
        }))
    }
    // check username is existed in DB
    userControllers
        .getUserByEmail(email)
        .then(user =>
        {
            if (user) {
                return getSaveProduct(req,res).then(data => res.render('signUp.ejs', {
                    message: `Email ${email} đã tồn tại!`,
                    type: 'alert-danger',
                    saveProducts: data
                }))
            }
            // Create new account
            user = {
                email: email,
                password
            }
            console.log(user)
            return userControllers.createUser(user)
                .then(user =>
                {
                    getSaveProduct(req,res).then(data => res.render('logIn.ejs', {
                        message: "Đăng ký tài khoản thành công, hãy đăng nhập!",
                        type: 'alert-primary',
                        saveProducts: data
                    }))
                })
        })
        .catch(error => next(error))


})

router.get("/logout", (req, res, next) =>
{
    req.session.destroy(error =>
    {
        if (error) {
            return next(error);
        }
        return res.redirect("/user/login")
    })
})


router.get("/forgot", (req, res, next) =>
{
    getSaveProduct(req,res).then(data => res.render('forgot.ejs', {
        message: "Nhập email của bạn, chúng tôi sẽ gửi cho bạn hướng dẫn.",
        saveProducts: data
    }))
})

router.post('/forgot', (req, res, next) =>
{
    let email = req.body.email

    // Kiểm tra email có tồn tại không?
    userControllers.getUserByEmail(email)
        .then(user =>
        {
            if (user) {
                // Nếu có thì tạo link
                let token = userControllers.createJWT(email);
                let host = req.header('host');
                let url = `${req.protocol}://${host}/user/reset?u=${email}&t=${token}`;

                // Gửi email
                userControllers.sendResetPassword(user, host, url)
                    .then((result) =>
                    {
                        // Nếu gửi email thành công
                        getSaveProduct(req,res).then(data => res.render("forgot", {
                            done: 1,
                            email,
                            saveProducts: data
                        }))

                    })
                    .catch((err) =>
                    {
                        return getSaveProduct(req,res).then(data => res.render("forgot.ejs", {
                            message: 'Lỗi xảy ra khi cố gắng gửi đến mail của bạn. Hãy thử lại!',
                            type: 'alert-danger',
                            email,
                            saveProducts: data
                        }))
                    })

            } else {
                // Ngược lại, nếu email không tồn tại
                return getSaveProduct(req,res).then(data => res.render("forgot.ejs", {
                    message: `Email chưa được đăng ký! Sử dụng email khác hoặc <a href="/user/signup"> Đăng ký </a>`,
                    type: 'alert-danger',
                    email,
                    saveProducts: data
                }))
            }

        })
        .catch(error => next(error))
})

router.get('/reset', (req, res, next) =>
{
    // trước khi hiển thị form, ta lấy token và username
    let email = req.query.u;
    let token = req.query.t;
    if (!email || !token) {
        return res.redirect('/user/forgot');
    }
    let isVerify = userControllers.verifyJWT(token);

    if (isVerify) {
        getSaveProduct(req,res).then(data => res.render('reset.ejs', {
            email, message: "Hãy nhập mật khẩu mới!",
            saveProducts: data
        }))
    }
    else { // link đã hết hạn.
        return getSaveProduct(req,res).then(data => res.render('forgot.ejs', {
            message: "Link xác thực đã hết hạn. Hãy nhập lại email của bạn, chúng tôi sẽ gửi cho bạn hướng dẫn!",
            saveProducts: data
        }))
    }
})

router.post('/reset', (req, res, next) =>
{
    let email = req.body.email;
    let password = req.body.password;
    let confirmedPassword = req.body.confirmedPassword;

    if (password !== confirmedPassword) {
        return getSaveProduct(req,res).then(data => res.render('reset', {
            email,
            message: 'Mật khẩu không khớp',
            type: 'alert-danger',
            saveProducts: data
        }))
    }
    console.log("Emaillllll:", email)
    userControllers.getUserByEmail(email)
        .then(user =>
        {
            if (user) {
                console.log("da tim thay")
                user.password = password,
                    userControllers.updatePassword(user),
                    getSaveProduct(req,res).then(data => res.render('reset.ejs', {
                        done: 1,
                        saveProducts: data
                    }))
            } else {
                res.redirect('/user/forgot')
            }
        })
})

router.get('/add-product', (req, res, next) =>
{

    if (req.session.user != null) {
        let categoryController = require('../controllers/categoryControllers');
        categoryController
            .getAll()
            .then(data =>
            {
                res.locals.categories = data;
                return getSaveProduct(req, res).then(data => res.render('new-product.ejs', {
                    saveProducts: data
                }))
            });
    }
    else {
        return getSaveProduct(req, res).then(data => res.render('logIn.ejs', {
            saveProducts: data
        }))
    }
});

const multer = require('multer')
var storage = multer.diskStorage({
    destination: (req, file, callBack) =>
    {
        callBack(null, './uploads/images/')     // './public/images/' directory name where save the file
    },
    filename: (req, file, callBack) =>
    {
        console.log(file)
        callBack(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

const path = require('path');
var upload = multer({
    storage: storage
});

router.post('/add-product', upload.single('image'), (req, res, next) =>
{
    let filepath = req.file.path;
    filepath = path.join("../../", filepath)

    var path2 = filepath.replace(/\\/g, "/");
    console.log(path2);
    console.log(filepath)
    console.log(req.body.category)
    const product = {
        name: req.body.title,
        price: req.body.price,
        description: req.body.description,
        imagePath: path2,
        ownerId: req.session.user.id,
        productId: Math.floor(Math.random() * 2147483647),
        categoryId: req.body.category,
        availability: req.body.quantity,
    };
    let categoryController = require('../controllers/categoryControllers');
    if (userControllers.addProduct(product)) {
        categoryController
            .getAll()
            .then(data =>
            {
                res.locals.categories = data;
                return getSaveProduct(req, res).then(data => res.render('new-product.ejs', {
                    message: 'success',
                    saveProducts: data
                }))
            })
    }
    else {
        categoryController
            .getAll()
            .then(data =>
            {
                res.locals.categories = data;
                return getSaveProduct(req, res).then(data => res.render('new-product.ejs', {
                    message: 'error',
                    saveProducts: data
                }))
            })
    }
});

router.get('/orders-manager', (req, res, next) =>
{

    let productController = require('../controllers/productControllers');
    let userControllers = require('../controllers/userControllers');

    console.log(req.session.user);
    if (req.session.user == null) {
        return getSaveProduct(req, res).then(data =>
        {
            res.locals.saveProducts = data;
            res.redirect('login')
        });
    }

    let ownerId = req.session.user.id;
    // let orders = productController.getPlacedOrder(ownerId);
    productController.getPlacedOrder(ownerId)
        .then(data =>
        {
            res.locals.orders = data;
            return getSaveProduct(req, res).then(data =>
            {
                res.locals.saveProducts = data;
                res.render('orders-manager');
            });
        });
});

router.get("/manage-rental-products", (req, res, next) =>
{
    let productController = require('../controllers/productControllers');
    let userControllers = require('../controllers/userControllers');

    let userId = req.session.user.id;
    // console.log(userId)
    productController.getRentingProducts(userId)
        .then(data =>
        {
            console.log(data)
            return getSaveProduct(req, res).then(data1 =>
            {
                res.locals.saveProducts = data1;
                res.render('manage-rental-products', { rentingProducts: data });
            });
        });
})

module.exports = router;