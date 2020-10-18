const jwt = require('jsonwebtoken')
const creatError = require('http-errors')
const { NotExtended } = require('http-errors')

module.exports = {
    signAccessToken: (userId) => {
        return new Promise((resolve, reject) => {

            const payload = {}
            const privateKey = process.env.ACCESS_TOKEN_KEY
            const options = {
                expiresIn: '1h',
                issuer: 'tazbinur.info',
                audience: userId
            }

            jwt.sign(payload, privateKey, options, (err, token) => {
                if (err) return reject(err)
                resolve(token)
            })

        })
    }
}