const express = require('express')
const { screen } = require('../controllers/screener')

const router = express.Router()

router.post('/', screen)

module.exports = router