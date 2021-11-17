const router = require('express').Router()

const teacher = require('./handler')

router.get('/promote/:id', [auth, authTeacher], teacher.promote)
router.get('/demote/:id', [auth, authTeacher], teacher.demote)
router.post('/grade', [auth, authTeacher], teacher.grade)
router.get('/students', [auth, authTeacher], teacher.students)

module.exports = router
