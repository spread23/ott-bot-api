const jwt = require('jwt-simple')
const { config } = require('dotenv')
const moment = require('moment')

config()

const secretKey = process.env.SECRET 

const createToken = (recruiter) => {
    const payload = {
        id: recruiter._id,
        name: recruiter.name,
        lastname: recruiter.lastname,
        user: recruiter.user,
        email: recruiter.email,
        iat: moment().unix(),
        exp: moment().add(30, 'days')
    }

    return jwt.encode(payload, secretKey)
}

module.exports = {
    createToken,
    secretKey
}
