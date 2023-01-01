// Nơi truy cập đầu tiên vào 1 đường link
import express from "express";
import homeController from "../controllers/homeController"
let router = express.Router();



let initWebRoutes = (app => {
    // router.get("/", homeController.getIndexPage)
    // router.get("/login", homeController.getLoginPage)
    // router.get("/signup", homeController.getSignupPage)
    router.get("/home", homeController.getHomePage)
    // rest api
    return app.use("/", router)
})


export default initWebRoutes;