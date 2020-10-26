const express = require('express')
const creatError = require('http-errors')
const user = require('../models/user.model')
const { authSchema } = require('../helper/auth_validation')
const { signAccessToken, signRefreshToken, verifiRefreshToken } = require('../helper/jwt_helper')
const router = express.Router()
const bcrypt = require('bcrypt')
const client = require('../helper/init_redis')

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
        const accessToken = await signAccessToken(saveUser.id)
        res.send({ accessToken })

    } catch (error) {
        if (error.isJoi === true) error.status = 422
        next(error)
    }
})

router.post('/login', async(req, res, next) => {
    try {
        // validation
        const result = await authSchema.validateAsync(req.body)
        if (!result) throw creatError.BadRequest('Invalied email/password')

        // finding user
        const findUser = await user.findOne({ email: result.email })
        if (!findUser) throw creatError.BadRequest('Invalied email/password')

        // de-hashing password
        var isCorrectPassword = false
        try {
            isCorrectPassword = await bcrypt.compare(result.password, findUser.password)
        } catch (error) {
            throw error
        }
        if (!isCorrectPassword) throw creatError.BadRequest('Incorrect password')

        const accessToken = await signAccessToken(findUser.id)
        const refreshToken = await signRefreshToken(findUser.id)
        res.send({ accessToken, refreshToken })

    } catch (error) {
        next(error)
    }
})

router.delete('/logout', async(req, res, next) => {
    try {
        const { refreshToken } = req.body
        if (!refreshToken) throw creatError.Unauthorized()

        const userId = await verifiRefreshToken(refreshToken)
        client.DEL(userId, (err, val) => {
            if (err) {
                console.log(err)
                throw creatError.Unauthorized()
            }
            console.log(val)
            res.sendStatus(204)
        })
    } catch (error) {
        next(error)
    }
})

router.post('/refresh-token', async(req, res, next) => {
    // verifiRefreshToken()
    try {
        const { refreshToken } = req.body
        const userId = await verifiRefreshToken(refreshToken)

        const accessToken = await signAccessToken(userId)
        const refToken = await signRefreshToken(userId)

        res.send({ accessToken: accessToken, refreshToken: refToken })
    } catch (error) {
        next(error)
    }
})

module.exports = router