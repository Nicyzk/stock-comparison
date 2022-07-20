const express = require('express')
const { getPosts, getPost } = require('../controllers/blog')

const router = express.Router()

router.get('/get-posts', getPosts)

router.post('/get-post', getPost)
module.exports = router