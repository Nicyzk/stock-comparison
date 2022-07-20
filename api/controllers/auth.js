const bcrypt = require('bcrypt')
const db = require('../util/db')
const jwt = require('jsonwebtoken')
require('dotenv').config()

exports.signUp = async (req, res, next) => {
    try {
        const { email, password } = req.body
        let text = 'SELECT * from users where email = $1'
        let result = await db.query(text, [email])
        const userList = result.rows
        if (userList.length >= 1) {
            const error = new Error('Email is already linked to a user.')
            error.statusCode = 422
            throw error
        }
        const hashPassword = await bcrypt.hash(password, 12)
        text = `INSERT INTO users (email, password) VALUES ($1, $2)`
        await db.query(text, [email, hashPassword])
        // Show success Modal 
        res.status(200).json({
            success: 'Account has been created successfully.'
        })
    } catch (err) {
        err.statusCode = err.statusCode || 500
        next(err)
    }
}

exports.login = async (req, res, next) => {
    const { email, password } = req.body
    try {
        let text = 'SELECT * from users where email = $1'
        let result = await db.query(text, [email])
        let userList = result.rows
        if (userList.length === 0) {
            const error = new Error('Incorrect username or password.')
            error.statusCode = 404
            throw error
        }
        if (userList.length === 1) {
            const user = userList[0]
            const match = await bcrypt.compare(password, user.password)
            if (match) {
                const token = jwt.sign({ email, user_id: user.user_id }, process.env.JWT_SECRET, { expiresIn: '1h' })
                res.status(200).json({
                    token,
                    user: {
                        email
                    }
                })
            } else {
                const error = new Error('Incorrect username or password.')
                error.statusCode = 404
                throw error
            }
        }

    } catch (err) {
        err.statusCode = err.statusCode || 500
        next(err)
    }
}


exports.logOut = (req, res, next) => {
    return res.status(200).json({
        message: "User logged out successfully."
    })
}
