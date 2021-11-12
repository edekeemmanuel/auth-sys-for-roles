const express = require("express");
const router = express.Router();
const authHandler = require("./handler");
// const auth = require("../../middleware/auth");
// const { upload } = require("../../utils/uploads");

router.post("/signin", authHandler.signin);
router.post("/signup", authHandler.signup);
router.get("/verify", authHandler.verify);

module.exports = router;