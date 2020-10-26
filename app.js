const express = require('express')
const creatErrors = require('http-errors')
const { verifyAccessToken } = require('./helper/jwt_helper')
require('dotenv').config()
require('./helper/init_mongodb')
require('./helper/init_redis')

// routes
const authRoute = require('./routes/auth.route')

const app = express()
const PORT = process.env.PORT || 3000
app.use(express.json())

// define routes
app.get('/', verifyAccessToken, (req, res, next) => {
    console.log(req.payload.aud)
    res.send('hello from get request')
})

app.use('/auth', authRoute)

// handle wildcard routes
app.use(async(req, res, next) => {
    // const err = new Error('Not found')
    // err.status = 404
    // next(err)
    next(creatErrors.NotFound('This route does not exits'))
})

app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.send({
        error: {
            status: err.status || 500,
            message: err.message || 'Internel server error'
        }
    })
})

// start the server
app.listen(PORT, () => {
    console.log(`server running at port ${PORT}...`)
})