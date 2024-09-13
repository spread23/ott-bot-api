const { Schema, model } = require('mongoose')

const RecruiterSchema = Schema({
    name: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    user: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        default: 'avatar.png'
    },
    created_at: {
        type: Date,
        default: Date.now()
    }
})

module.exports = model('Recruiter', RecruiterSchema, 'recruiters')