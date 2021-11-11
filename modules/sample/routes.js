const route = require("express").Router();
const home = require("./handler");
route.get("/", home.getHome);


module.exports = route;