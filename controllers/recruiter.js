const Recruiter = require('../models/recruiter')
const bcrypt = require('bcrypt')
const fs = require('fs')
const path = require('path')

const { createToken } = require('../services/jwt')

const testRecruiter = (req, res) => {
    return res.status(200).json({
        status: 'success',
        message: 'Endpoint de test de recruiter'
    })
}

const register = async (req, res) => {

    const params = req.body

    if (!params.name || !params.lastname || !params.user || !params.email || !params.password) {
        return res.status(400).json({
            status: 'error',
            message: 'Faltan parametros'
        })
    }

    try {
        const recruiterFound = await Recruiter.find({
            $or: [
                { user: params.user },
                { email: params.email }
            ]
        })

        if (recruiterFound && recruiterFound.length >= 1) {
            return res.status(200).json({
                status: 'error',
                message: 'El user ya existe'
            })
        }

        const pwd = await bcrypt.hash(params.password, 10)
        params.password = pwd

        const recruiterToSave = new Recruiter(params)
        const recruiterStorage = await recruiterToSave.save()

        return res.status(200).json({
            status: 'success',
            message: 'Registro exitoso',
            recruiter: recruiterStorage,
        })

    } catch (error) {
        return res.status(400).json({
            status: 'error',
            message: 'Error al registrar el user'
        })
    }
}

const login = async (req, res) => {

    const params = req.body

    if (!params.email || !params.password) {
        return res.status(400).json({
            status: 'error',
            message: 'Faltan parametros'
        })
    }

    try {
        const recruiterFound = await Recruiter.findOne({
            email: params.email
        })

        if (!recruiterFound) {
            return res.status(404).json({
                status: 'error',
                message: 'El user no existe'
            })
        }

        const pwd = bcrypt.compareSync(params.password, recruiterFound.password)
        if (!pwd) {
            return res.status(400).json({
                status: 'error',
                message: 'Las contraseñas no coinciden'
            })
        }

        const token = createToken(recruiterFound)


        return res.status(200).json({
            status: 'success',
            message: 'Login satisfactorio',
            recruiter: recruiterFound,
            token
        })

    } catch (error) {
        return res.status(400).json({
            status: 'error',
            message: 'Error en la consulta' + error.message
        })
    }
}

const getRecruiter = async (req, res) => {
    const id = req.params.id

    try {

        const recruiter = await Recruiter.findOne({
            _id: id
        })

        if (!recruiter) {
            return res.status(404).json({
                status: 'error',
                message: 'El recruiter no existe'
            })
        }

        return res.status(200).json({
            status: 'success',
            message: 'Get recruiter',
            recruiter
        })

    } catch (error) {
        return res.status(400).json({
            status: 'error',
            message: 'Error en la consulta'
        })
    }
}

const uploadAvatar = async (req, res) => {
    const id = req.params.id

    if (!req.file) {
        return res.status(404).json({
            status: 'error',
            message: 'La consulta no contiene ningun archivo'
        })
    }

    const avatar = req.file.originalname
    const avatarSplit = avatar.split('\.')
    const extension = avatarSplit[1]

    if (extension !== 'jpg' && extension !== 'png' && extension !== 'jpeg' && extension !== 'gif') {
        const filePath = req.file.path
        fs.unlinkSync(filePath)

        return res.status(400).json({
            status: 'error',
            message: 'La extension no es valida'
        })
    }

    try {

        const recruiterFound = await Recruiter.findByIdAndUpdate({
            _id: id
        }, { avatar: req.file.filename }, { new: true })

        if (!recruiterFound) {

            const filePath = req.file.path
            fs.unlinkSync(filePath)

            return res.status(400).json({
                status: 'error',
                message: 'No existe el user con ese id'
            })
        }

        return res.status(200).json({
            status: 'success',
            message: 'Archivo subido de manera exitosa',
            recruiter: recruiterFound
        })

    } catch (error) {
        const filePath = req.file.path
        fs.unlinkSync(filePath)

        return res.status(400).json({
            status: 'error',
            message: 'Error en la consulta' + error.message
        })
    }
}

const getAvatar = (req, res) => {
    const file = req.params.file
    const filePath = './uploads/avatars/' + file

    fs.stat(filePath, (error, exists) => {
        if (error || !exists) {
            return res.status(404).json({
                status: 'error',
                message: 'El archivo no existe'
            })
        }

        return res.sendFile(path.resolve(filePath))
    })
}

const update = async (req, res) => {

    const id = req.params.id
    const params = req.body

    if (params.password) {
        const pwd = await bcrypt.hash(params.password, 10)
        params.password = pwd
    }

    try {

        const recruiterToUpdate = await Recruiter.findByIdAndUpdate({
            _id: id
        }, params, { new:true })

        if (!recruiterToUpdate) {
            return res.status(404).json({
                status: 'error',
                message: 'No existe el recruiter'
            })
        }

        return res.status(200).json({
            status: 'success',
            message: 'Recruiter actualizado de manera satisfactoria',
            recruiter: recruiterToUpdate
        })


    } catch (error) {
        return res.status(400).json({
            status: 'error',
            message: 'Error en la consulta'
        })
    }
}

module.exports = {
    testRecruiter,
    register,
    login,
    uploadAvatar,
    getAvatar,
    getRecruiter,
    update
}