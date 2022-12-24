import express from "express";
import bodyParser from "body-parser"; // Hỗ trợ lấy các tham số mà phía client sử dụng: query, params
import viewEngine from "./config/viewEngine"
import initWebRoutes from "./route/web"
import connectDB from "./config/connectDB"
require('dotenv').config()

const app = express();
const port = process.env.PORT || 8080;

// cấu hình các tham số phía client gửi lên
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// config app
viewEngine(app);
initWebRoutes(app);

connectDB();

app.listen(port, () => {
    console.log(`Server is running at port ${port}`)
})