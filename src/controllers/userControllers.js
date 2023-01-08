
import db from '../models'
let controller = {}
let User = db.User
let Product = db.Product
let bcrypt = require("bcryptjs")
let jwt = require("jsonwebtoken")
require('dotenv').config()

const SECRET_KEY = "jlkasdfasdjf";

controller.getUserByEmail = (email) => {
    return User.findOne({
        where: { email: email }
    })
}

controller.createUser = (user) => {
    let salt = bcrypt.genSaltSync(10);
    user.password = bcrypt.hashSync(user.password, salt) // mã hóa mật khẩu
    return User.create(user)
}

controller.comparePassword = (password, hash) => {
    return bcrypt.compareSync(password, hash)
}

controller.createJWT = (email) => {
    // Tạo 1 token có thời gian
    return jwt.sign({
        email
    }, SECRET_KEY, { expiresIn: "30m" })
}

controller.verifyJWT = (token) => {
    try {
        jwt.verify(token, SECRET_KEY)
        return true;
    } catch (error) {
        return false;
    }
}

controller.sendResetPassword = (user, host, url) => {
    var Mailjet = require("node-mailjet");
    const mailjet = new Mailjet({
        apiKey: process.env.MJ_APIKEY_PUBLIC || 'd06622b89fb49bf77bd68cce62917113',
        apiSecret: process.env.MJ_APIKEY_PRIVATE || 'a7617c4ac3748a3471ac3bd39934949f'
    });

    const request = mailjet
        .post('send', { version: 'v3.1' })
        .request({
            Messages: [
                {
                    From: {
                        Email: "hdnminh.test@gmail.com",
                        Name: "Rentee shop"
                    },
                    To: [
                        {
                            Email: user.email,
                            Name: user.email
                        }
                    ],
                    Subject: "Đặt lại mật khẩu!",
                    // TextPart: "Dear passenger 1, welcome to Mailjet! May the delivery force be with you!",
                    HTMLPart: `
                    <p>Hi ${user.email},</p>
                    
                    <p>You recently requested to reset the password for your ${host} account. 
                    Click the link below to proceed.</p>
                    <br/>
                    <p><a href="${url}">Reset Password</a></p>
                    <br/>
                    <p>If you did not request a password reset, please ignore this email or reply to let us know. 
                    This password reset link is only valid for the next 30 minutes.</p>
                    <br/>
                    <p>Thanks,</p>
                    <p>Rentee Shop</p>`
                }
            ]
        })
    return request;
}

controller.updatePassword = (user) => {
    let salt = bcrypt.genSaltSync(10);
    user.password = bcrypt.hashSync(user.password, salt) // mã hóa mật khẩu
    return User.update({
        password: user.password,
    },
        {
            where: { id: user.id }
        })
}

controller.addProduct = async(product) => {
    const p = await Product.create(product);
    if(p instanceof Product){
        return true;
    }
    return false;
}
module.exports = controller;