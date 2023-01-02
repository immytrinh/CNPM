import express from "express";
import bodyParser from "body-parser"; // Hỗ trợ lấy các tham số mà phía client sử dụng: query, params
import viewEngine from "./config/viewEngine"
import connectDB from "./config/connectDB"
require('dotenv').config()
//Use cookie
import cookieParser from "cookie-parser";
import session from "express-session";

const app = express();
const port = process.env.PORT || 3030;

// cấu hình các tham số phía client gửi lên
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

//use session: sử dụng cơ chế cookie
app.use(session({
    cookie: { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 },
    secret: "Secret",
    resave: false,
    saveUninitialized: false
}))


// config app
viewEngine(app);

connectDB();
// Khởi tạo biến session
app.use((req, res, next) => {
    res.locals.email = req.session.user ? req.session.user.email : '';
    res.locals.isLoggedIn = req.session.user ? true : false;
    next();
})


app.use("/", require('./route/indexRouter'))
app.use("/user", require("./route/userRouter"))
app.use("/products", require('./route/productRouter'))

app.listen(port, () => {
    console.log(`Server is running at port ${port}`)
})