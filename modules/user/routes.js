const router = require("express").Router();
const user = require("./handler");
const auth = require("../../middleware/auth")
const authAdmin = require("../../middleware/adminAuth")

router.post("/signin", user.signin);
router.post("/signup", auth, authAdmin, user.createUser);
router.get("/profile/:id", auth, user.getProfile);
router.get("/verify", user.verify);
router.delete('/delete/:id', auth, authAdmin, user.deleteUser)

module.exports = router;