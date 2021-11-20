const route = require('express').Router();
route.get("/admin", (req, res) => {
    res.send("admin");
})
module.exports = route;
