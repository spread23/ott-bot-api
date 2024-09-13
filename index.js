const express = require('express')
const cors = require('cors')
const { config } = require('dotenv')

const UserRouter = require('./routes/user')
const RecruiterRouter = require('./routes/recruiter')
const OfferRouter = require('./routes/offer')
const connection = require('./database/connection')

config()
connection()

const app = express()
const port = 3000 ?? process.env.port

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors())

app.get('/', (req, res) => {
    return res.status(200).json({
        status: 'success',
        message: 'Endpoint de prueba'
    })
})

app.use('/api/user', UserRouter)
app.use('/api/recruiter', RecruiterRouter)
app.use('/api/offer', OfferRouter)

app.listen(port, () => {
    console.log('Server is listenning on port ', port)
})