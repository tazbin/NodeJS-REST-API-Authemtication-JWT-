const express = require('express')
const creatError = require('http-errors')
const user = require('../models/user.model')
const { authSchema } = require('../helper/auth_validation')
const { signAccessToken } = require('../helper/jwt_helper')
const router = express.Router()

router.post('/register', async(req, res, next) => {
    try {
        // validation
        const result = await authSchema.validateAsync(req.body)

        // rdandent value checking
        const existUser = await user.findOne({ email: result.email })
        if (existUser)
            throw creatError.Conflict(`${result.email} already exists`)

        // creat & save new user
        const newUser = new user(result)
        const saveUser = await newUser.save()
            // res.send(saveUser)
        const accessToken = await signAccessToken(saveUser.id)
        res.send({ accessToken })

    } catch (error) {
        if (error.isJoi === true) error.status = 422
        next(error)
    }
})

router.get('/list', async(req, res, next) => {
    try {
        // const allUsers = await user.find()
        res.send('allUsers')
    } catch (error) {
        next(error)
    }
})

router.post('/login', (req, res, next) => {
    res.send('login router')
})

router.delete('/logout', (req, res, next) => {
    res.send('logout router')
})

router.post('/refresh-token', (req, res, next) => {
    res.send('refresh-token router')
})

module.exports = router