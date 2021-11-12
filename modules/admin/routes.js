const express = require("express");
const router = express.Router();
const admin = require("./handler");
const auth = require("../../middleware/auth")
const authRole = require("../../middleware/adminAuth")
console.log(authRole)

// @route   POST /admin/signin
router.post("/signin", admin.signin);
router.get("/create-super-admin", admin.superAdmin);
router.get("/dashboard", auth, authRole, admin.dashboard)

module.exports = router;
