const express = require('express')
const { pool } = require('./util/db')
const bodyParser = require('body-parser')

const screenerRoutes = require('./routes/screener')
const portfolioRoutes = require('./routes/portfolio')
const authRoutes = require('./routes/auth')
const userProfileRoutes = require('./routes/userProfile')
const blogRoutes = require('./routes/blog')

const port = 3001

const app = express()
app.use(bodyParser.json())
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
    res.setHeader('Access-Control-Allow-Headers', ' Content-Type, Authorization')
    next()
})

// Impt: Handle pre-flight
// Each request is actually 2 requests. 1) pre-flight requests for CORS policy. OPTIONS method to url specified. 2) Actual request
// Options method enters endpoint of POST/GET request. If found, implicitly responded with status 200. Client then sends actual request.
// Without below, if no endpoint found, pre-flight responded with 404, causing failure.  
app.options('/*', (req, res, next) => {
    return res.status(200).json({})
})

app.use('/api', express.static(__dirname + '/public'))

app.use('/api/screener', screenerRoutes)
app.use('/api/portfolio', portfolioRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/user-profile', userProfileRoutes)
app.use('/api/blog', blogRoutes)

app.use('/api/', (req, res, next) => {
    res.status(404).json({
        message: "Endpoint not found"
    })
})

app.use((error, req, res, next) => {
    const status = error.statusCode || 500
    const message = error.message
    res.status(status).json({
        message
    })
})

const startDBConnection = async function () {
    const client = await pool.connect()
    client.query('SELECT NOW()')
    return client.release()
}

startDBConnection()
.then(() => {
    console.log('DB connected')
    app.listen(port)
})
.catch((err) => console.log(err.message))