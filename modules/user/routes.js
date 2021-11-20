const router = require("express").Router();
const user = require("./handler");
const auth = require("../../middleware/auth")
const authAdmin = require("../../middleware/adminAuth")

// routes
router.post('/authenticate', authenticate);
router.post('/register', register);
router.get('/', getAll);
router.get('/current', getCurrent);
router.get('/:id', getById);
router.put('/:id', update);
router.delete('/:id', _delete);

module.exports = router;

