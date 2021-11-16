const express = require("express");
const router = express.Router();
const admin = require("./handler");
const auth = require("../../middleware/auth")
const authRole = require("../../middleware/adminAuth")

// @route   POST /admin/signin
router.post("/signin", admin.signin);
router.post("/create-user", admin.createUser)
router.get("/create-super-admin", admin.superAdmin);
router.get("/dashboard", auth, authRole, admin.dashboard)

module.exports = router;
