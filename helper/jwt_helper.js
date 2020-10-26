const jwt = require('jsonwebtoken')
const creatError = require('http-errors')
const client = require('./init_redis')

module.exports = {
    signAccessToken: (userId) => {
        return new Promise((resolve, reject) => {

            const payload = {}
            const privateKey = process.env.ACCESS_TOKEN_KEY
            const options = {
                expiresIn: '20s',
                issuer: 'tazbinur.info',
                audience: userId
            }

            jwt.sign(payload, privateKey, options, (err, token) => {
                if (err) {
                    console.log(err)
                    return reject(creatError.InternalServerError())
                }
                resolve(token)
            })

        })
    },

    signRefreshToken: (userId) => {
        return new Promise((resolve, reject) => {

            const payload = {}
            const privateKey = process.env.REFRESH_TOKEN_KEY
            const options = {
                expiresIn: '1y',
                issuer: 'tazbinur.info',
                audience: userId
            }

            jwt.sign(payload, privateKey, options, (err, token) => {
                if (err) {
                    console.log(err)
                    return reject(creatError.InternalServerError())
                }

                console.log('signing refresh token..')

                client.SET(userId, token, 'EX', 365 * 24 * 60 * 60, (err, reply) => {
                    if (err) {
                        console.log(err)
                        reject(creatError.InternalServerError())
                        return
                    }
                    resolve(token)
                })
            })

        })
    },

    verifyAccessToken: (req, res, next) => {
        if (!req.headers['authorization'])
            next(creatError.Unauthorized())

        const accessToken = req.headers['authorization'].split(' ')[1]

        jwt.verify(accessToken, process.env.ACCESS_TOKEN_KEY, function(err, decoded) {
            if (err) {
                // if (err.name == 'TokenExpiredError') {
                //     next(creatError.Unauthorized(err.message))
                // } else {
                //     next(creatError.Unauthorized())
                // }
                const errMessage = err.name === 'TokenExpiredError' ? err.message : 'Unauthorized access'
                next(creatError.Unauthorized(errMessage))
            }

            req.payload = decoded
            next()
        })
    },

    verifiRefreshToken: (refreshToken) => {
        return new Promise((resolve, reject) => {
            jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY, function(err, payload) {
                if (err) {
                    console.log(err)
                    return reject(creatError.Unauthorized())
                }

                client.get(payload.aud, (err, result) => {
                    if (err) {
                        console.log(err)
                        reject(creatError.InternalServerError())
                        return
                    }

                    if (result == refreshToken) return resolve(payload.aud)
                    reject(creatError.Unauthorized())
                })
            })
        })
    }
}