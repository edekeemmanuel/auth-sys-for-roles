const route = require("express")();
const home = require("./handler");

// /admin
route.get("/", home.getHome);
// /admin/create
// route.post("/create", home.createUser);
// /admin/getOne/1232456373
// route.get("/getOne/:id", home.createUser);

module.exports = route;