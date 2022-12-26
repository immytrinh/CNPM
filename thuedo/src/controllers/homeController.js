import db from '../models/index'

// let getIndexPage = async (req, res) => {
//     return res.render("index.ejs")
// }

// let getLoginPage = async (req, res) => {
//     return res.render("logIn.ejs")
// }

// let getSignupPage = async (req, res) => {
//     return res.render("signUp.ejs")
// }

let getHomePage = async (req, res) => {
    return res.render("home.ejs")
}
module.exports = {
    getHomePage
}