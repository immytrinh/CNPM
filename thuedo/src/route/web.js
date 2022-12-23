// Nơi truy cập đầu tiên vào 1 đường link
import express from "express";
import homeController from "../controllers/homeController"
let router = express.Router();



let initWebRoutes = (app => {
    router.get("/", homeController.getHomepage)

    // rest api
    return app.use("/", router)
})

export default initWebRoutes;