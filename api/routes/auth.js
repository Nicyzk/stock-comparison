const express = require('express')
const { signUp, login, logOut } = require('../controllers/auth')

const router = express.Router()

router.post('/sign-up', signUp)

router.post('/login', login)

router.post('/logout', logOut)

module.exports = router