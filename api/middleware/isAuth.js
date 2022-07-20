const jwt = require('jsonwebtoken')

exports.isAuth = (req, res, next) => {
    try {
        const token = req.header('Authorization').split(" ")[1]
        const user = jwt.verify(token, process.env.JWT_SECRET)
        req.user = user
        next()
    } catch (error) {
        error.statusCode = 400
        error.message = "Authorization failed"
        throw error
    }
}