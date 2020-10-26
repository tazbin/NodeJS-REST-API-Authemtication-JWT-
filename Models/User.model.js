const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const creatError = require('http-errors')
const saltRounds = 10;
const Schema = mongoose.Schema

const userSchema = new Schema({
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
        const hashedPassword = await bcrypt.hash(this.password, saltRounds)
        this.password = hashedPassword
        next()
    } catch (error) {
        next(error)
    }
})

// defining methods
userSchema.methods.isValidPassword = async function(password) {
    try {
        return await bcrypt.compare(password, this.password)
    } catch (error) {
        throw error
    }
}

const user = mongoose.model('user', userSchema)
module.exports = user