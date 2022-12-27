
import db from '../models'
let controller = {}
let User = db.User
let bcrypt = require("bcryptjs")

controller.getUserByEmail = (email) => {
    console.log(email)
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
module.exports = controller;