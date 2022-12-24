import db from '../models/index'

let getHomepage = async (req, res) => {
    try {
        let data = await db.User.findAll(); // findAll(): tìm tất cả dữ liệu trong bảng user
        return res.render("homepage.ejs", { data: JSON.stringify(data) })
    } catch (e) {
        console.log(e)
    }
}


module.exports = {
    getHomepage
}