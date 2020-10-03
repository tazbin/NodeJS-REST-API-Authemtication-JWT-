const express = require('express')
const creatError = require('http-errors')
const userModel = require('../Models/User.model')
const { userSchema } = require('../helpers/auth_validation')
const { signAccessToken } = require('../helpers/jwt_helper')
const router = express.Router()


router.post('/register', async(req, res, next) => {
    try {
        const result = await userSchema.validateAsync(req.body)

        const emailExists = await userModel.findOne({ email: result.email })
        if (emailExists) throw creatError.Conflict(`${result.email} already exists`)

        const newUser = new userModel(result)
        const saveUser = await newUser.save()
            // res.send(saveUser)
        const accessToken = await signAccessToken(saveUser.id)
        res.send({ accessToken })

    } catch (error) {
        if (error.isJoi === true) {
            error.status = 422
        }
        next(error)
    }
})

router.post('/login', async(req, res, next) => {
    try {
        const result = await userSchema.validateAsync(req.body)
        const user = await userModel.findOne({ email: result.email })
        if (!user) {
            throw creatError.NotFound('User not registered')
        }
        const isMatch = await user.isValidPassword(result.password)
        if (!isMatch) throw creatError.Unauthorized('Email/password not matched')

        const accessToken = await signAccessToken(user.id)

        res.send({ accessToken })
    } catch (error) {
        if (error.isJoi === true) error = creatError.BadRequest('Invalied email/password')
        next(error)
    }
})

router.post('/refresh-token', async(req, res, next) => {
    res.send('refresh-token router')
})

router.delete('/logout', async(req, res, next) => {
    res.send('logout route')
})

module.exports = router