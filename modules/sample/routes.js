const route = require("express").Router();
const home = require("./handler");
route.get("/home", home.getHome);


module.exports = route;