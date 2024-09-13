const { model, Schema } = require('mongoose')

const UserSchema = Schema({
    name: {
        type: String,
        required: true
    },
    tel: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    experience: {
        type: String,
        required: true
    },
    talents: {
        type: String,
        required: true
    },
    availability: {
        type: String,
        required: true
    },
    cv: {
        type: String,
        default: 'cv.pdf'
    },
    video: {
        type: String,
        default: 'video.mp4'
    },
    recruiter: [{
        type: Schema.Types.ObjectId,
        ref: 'Recruiter'
    }],
    created_at: {
        type: Date,
        default: Date.now()
    }
})

module.exports = model('User', UserSchema, 'users')