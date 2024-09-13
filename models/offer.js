const { model, Schema } = require('mongoose')

const OfferSchema = Schema({
    recruiter: {
        type: Schema.Types.ObjectId,
        ref: 'Recruiter'
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    area: {
        type: String,
        required: true
    },
    experience: {
        type: String,
        required: true
    },
    availability: {
        type: String,
        required: true
    },
    salary: {
        type: String,
        required: true
    },
    languajes: {
        type: String,
        required: true
    },
    user: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
})

module.exports = model('Offer', OfferSchema, 'offers')