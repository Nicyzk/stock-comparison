const express = require('express')
const { getName, getProfile, getPL, getRatios } = require('../controllers/portfolio')

const router = express.Router()

router.post('/name', getName)
router.post('/profile', getProfile)
router.post('/pl', getPL)
router.post('/ratios', getRatios)

module.exports = router