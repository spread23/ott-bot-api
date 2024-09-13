const jwt = require('jwt-simple')
const moment = require('moment')

const { secretKey } = require('../../services/jwt')

exports.auth = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).json({
            status: 'error',
            message: 'La consulta no contiene la autorizacion de cabecera'
        })
    }

    const token = req.headers.authorization.replace(/["']+/g, '')

    try {

        const payload = jwt.decode(token, secretKey)

        if (payload.exp <= moment().unix()) {
            return res.status(401).json({
                status: 'error',
                message: 'El token ha expirado'
            })
        }

        req.recruiter = payload

    } catch (error) {
        return res.status(403).json({
            status: 'error',
            message: 'Error en el token'
        })
    }

    next()
}