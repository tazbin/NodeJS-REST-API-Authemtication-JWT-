const express = require('express')
const creatError = require('http-errors')
require('dotenv').config()
require('./helpers/init_mongo_db')

// route imports
const authRoutes = require('./Routes/Auth.route')

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// routes
app.get('/', async(req, res, next) => {
    res.send('hello from server')
})

app.use('/auth', authRoutes)

app.use(async(req, res, next) => {
    next(creatError.NotFound('This route does not exits'))
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

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`server listening to port ${port}...`)
})