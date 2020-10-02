const express = require('express')
const creatError = require('http-errors')
const userModel = require('../Models/User.model')
const { userSchema } = require('../helpers/auth_validation')
const router = express.Router()


router.post('/register', async(req, res, next) => {
    try {
        const result = await userSchema.validateAsync(req.body)

        const emailExists = await userModel.findOne({ email: result.email })
        if (emailExists) throw creatError.Conflict(`${result.email} already exists`)

        const newUser = new userModel(result)
        const saveUser = await newUser.save()
        res.send(saveUser)

    } catch (error) {
        if (error.isJoi === true) {
            error.status = 422
        }
        next(error)
    }
})

router.post('/login', async(req, res, next) => {
    res.send('login router')
})

router.post('/refresh-token', async(req, res, next) => {
    res.send('refresh-token router')
})

router.delete('/logout', async(req, res, next) => {
    res.send('logout route')
})

module.exports = router