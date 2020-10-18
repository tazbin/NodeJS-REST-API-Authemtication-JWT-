const express = require('express')
const creatErrors = require('http-errors')
require('dotenv').config()
require('./helper/init_mongodb')

// routes
const authRoute = require('./routes/auth.route')

const app = express()
const PORT = process.env.PORT || 3000
app.use(express.json())

// define routes
app.get('/', (req, res, next) => {
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