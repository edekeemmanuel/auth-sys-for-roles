const router = require('express').Router()

const teacher = require('./handler')

router.get('/promote', teacher.promote)
router.get('/demote', teacher.demote)
router.get('/grade', teacher.grade)

module.exports = router