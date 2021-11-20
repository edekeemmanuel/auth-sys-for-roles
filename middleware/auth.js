const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function(req, res, next) {  
  const authToken = req.headers["x-access-token"] || req.headers["authorization"];
  if (!authToken) return res.status(401).send("Access denied. No token provided.");
  try {
    const decoded = jwt.verify(authToken, config.get("privatekey"));
    req.user = decoded;
    next();
  } catch (ex) {    
    res.status(400).send("Invalid token.");
  }
};