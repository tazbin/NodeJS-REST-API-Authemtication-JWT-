const { NotExtended } = require('http-errors')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const schema = mongoose.Schema

const userSchema = new schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
})

userSchema.pre('save', async function(next) {
    try {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(this.password, salt)
        this.password = hashedPassword
        next()
    } catch (error) {
        next(error)
    }
})

userSchema.methods.isValidPassword = async function(password) {
    try {
        return bcrypt.compare(password, this.password)
    } catch (error) {
        next(error)
    }
}

const user = mongoose.model('user', userSchema)
module.exports = user