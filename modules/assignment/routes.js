const router = require('express').Router()
const assignment = require('./handler')
const auth = require('../../middleware/auth')
const authTeacher = require('../../middleware/teacherAuth')
const {log} = console
// log(assignment)

router.post('/', [auth, authTeacher], assignment.create)
router.get('/', [auth, authTeacher], assignment.find)
router.get('/:id',[auth, authTeacher], assignment.findOne)
router.put('/:id', [auth, authTeacher], assignment.update)
router.delete('/:id',[auth, authTeacher], assignment.delete)

module.exports = router

