import express from "express";
const expressLayouts = require('express-ejs-layouts')

const configViewEngine = (app) => {
    console.log(__dirname)
    app.use(express.static('./src/public'));
    app.use(expressLayouts)
    app.set("view engine", "ejs")
    app.set("layout", "./layouts/layout")

    app.set("views", "./src/views")
}

export default configViewEngine;