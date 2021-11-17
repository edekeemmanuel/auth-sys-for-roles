const router = require('express').Router()

const teacher = require('./handler')

router.get('/promote/:id', teacher.promote)
router.get('/demote/:id', teacher.demote)
router.post('/grade', teacher.grade)
router.get('/students', teacher.students)

module.exports = router