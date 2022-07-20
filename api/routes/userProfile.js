const express = require('express')
const { createNewPortfolio, getUserPortfolios, addToPortfolio, removeFromPortfolio, deletePortfolio } = require('../controllers/userProfile')
const { isAuth } = require('../middleware/isAuth')

const router = express.Router()

router.post('/get-portfolios', isAuth, getUserPortfolios)

router.post('/portfolio/new', isAuth, createNewPortfolio)

router.post('/portfolio/add-tickers', isAuth, addToPortfolio)

router.post('/portfolio/remove-tickers', isAuth, removeFromPortfolio)

router.post('/portfolio/delete', isAuth, deletePortfolio)


module.exports = router