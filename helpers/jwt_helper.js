const jwt = require('jsonwebtoken');
const creatErrors = require('http-errors')

module.exports = {
    signAccessToken: (userId) => {
        return new Promise((resolve, reject) => {

            const paylaod = {}
            const secret = process.env.ACCESS_TOKEN_SECRET
            const option = {
                expiresIn: '1h',
                issuer: 'mywebsite.com',
                audience: userId
            }

            jwt.sign(paylaod, secret, option, (err, token) => {
                if (err) reject(err)
                resolve(token)
            })

        })
    }
}