const User = require('../models/user')
const fs = require('fs')
const path = require('path')

const testUser = (req, res) => {
    return res.status(200).json({
        status: 'success',
        message: 'Endpoint de test de user'
    })
}

const register = async (req, res) => {
    const params = req.body

    if (!params.name || !params.tel || !params.email || !params.experience || !params.talents || !params.availability) {
        return res.status(400).json({
            status: 'error',
            message: 'Faltan parametros'
        })
    }

    try {

        const userToSave = new User(params)
        const userStorage = await userToSave.save()

        return res.status(200).json({
            status: 'success',
            message: 'Registro exitoso',
            user: userStorage
        })

    } catch (error) {
        return res.status(400).json({
            status: 'error',
            message: 'Error en la consulta'
        })
    }
}

const getUsers = async (req, res) => {

    try {

        const users = await User.find()

        if (!users || users.length <= 0) {
            return res.status(200).json({
                status: 'error',
                message: 'No hay users para mostrar'
            })
        }

        return res.status(200).json({
            status: 'success',
            message: 'Users',
            users
        })

    } catch (error) {
        return res.status(400).json({
            status: 'error',
            message: 'Error en la consulta'
        })
    }
}

const getUser = async (req, res) => {

    const id = req.params.id

    try {

        const user = await User.findOne({
            _id: id
        })

        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'El usuario no existe'
            })
        }

        return res.status(200).json({
            status: 'success',
            message: 'Usuario enviado correctamente',
            user
        })

    } catch (error) {
        return res.status(400).json({
            status: 'error',
            message: 'Error en la consulta'
        })
    }
}

const update = async (req, res) => {
    const id = req.params.id;
    const params = req.body;

    try {

        const userFound = await User.findByIdAndUpdate({
            _id: id
        }, params, { new: true })

        if (!userFound) {

            return res.status(400).json({
                status: 'error',
                message: 'No existe el user con ese id'
            })
        }

        return res.status(200).json({
            status: 'success',
            message: 'Archivo subido de manera exitosa',
            recruiter: userFound
        })

    } catch (error) {

        return res.status(400).json({
            status: 'error',
            message: 'Error en la consulta' + error.message
        })
    }
}

const uploadPdf = async (req, res) => {
    const id = req.params.id

    if (!req.file) {
        return res.status(404).json({
            status: 'error',
            message: 'No se encontro el archivo en la consulta'
        })
    }

    const cv = req.file.originalname
    const cvSplit = cv.split('\.')
    const extension = cvSplit[1]

    if (extension !== 'pdf' && extension !== 'word') {
        const filePath = req.file.path
        fs.unlinkSync(filePath)

        return res.status(400).json({
            status: 'error',
            message: 'La extension no es valida'
        })
    }

    try {

        const userToUpdate = await User.findByIdAndUpdate({
            _id: id
        }, { cv: req.file.filename }, { new: true })

        if (!userToUpdate) {
            const filePath = req.file.path
            fs.unlinkSync(filePath)

            return res.status(400).json({
                status: 'error',
                message: 'El user no existe'
            })
        }

        return res.status(200).json({
            status: 'success',
            message: 'Subiste el documento de manera satisfactoria',
            user: userToUpdate
        })


    } catch (error) {

        const filePath = req.file.path
        fs.unlinkSync(filePath)

        return res.status(400).json({
            status: 'error',
            message: 'error en la consulta ' + error.message
        })
    }
}

const getPdf = (req, res) => {

    const file = req.params.file
    const filePath = './uploads/cvs/' + file

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

const uploadVideo = async (req, res) => {
    const id = req.params.id

    if (!req.file) {

        return res.status(404).json({
            status: 'error',
            message: 'La consulta no contiene ningun archivo'
        })
    }

    const video = req.file.originalname
    const splitVideo = video.split('\.')
    const extension = splitVideo[1]

    if (extension !== 'mp4' && extension !== 'mkv' && extension !== 'avi' && extension !== 'mov') {

        const filePath = req.file.path
        fs.unlinkSync(filePath)

        return res.status(400).json({
            status: 'error',
            message: 'La extension no es valida'
        })
    }

    try {

        const userToUpdate = await User.findByIdAndUpdate({
            _id: id
        }, { video: req.file.filename }, { new: true })

        if (!userToUpdate) {

            const filePath = req.file.path
            fs.unlinkSync(filePath)

            return res.status(404).json({
                status: 'error',
                message: 'El user no existe'
            })
        }

        return res.status(200).json({
            status: 'success',
            message: 'Archivo subido con exito',
            userToUpdate
        })

    } catch (error) {

        const filePath = req.file.path
        fs.unlinkSync(filePath)

        return res.status(400).json({
            status: 'error',
            message: 'Error en la consulta'
        })
    }
}

const getVideo = (req, res) => {

    const file = req.params.file
    const filePath = './uploads/videos/' + file

    fs.stat(filePath, (error, exists) => {
        if (error, !exists) {
            return res.status(404).json({
                status: 'error',
                message: 'El archivo no existe'
            })
        }

        return res.sendFile(path.resolve(filePath))
    })
}

const addToFav = async (req, res) => {
    const idUser = req.params.id_user
    const idRecruiter = req.params.id_recruiter

    try {

        const user = await User.findByIdAndUpdate({
            _id: idUser
        }, { $addToSet: { recruiter: idRecruiter } }, { new: true })

        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'No existe el user'
            })
        }

        return res.status(200).json({
            status: 'success',
            message: 'Has agregado el user a favoritos correctamente',
            user
        })

    } catch (error) {
        return res.status(400).json({
            status: 'error',
            message: 'Error en la consulta'
        })
    }
}

const getFav = async (req, res) => {
    const id = req.params.id

    try {

        const users = await User.find({
            recruiter: id
        })

        if (!users || users.length <= 0) {
            return res.status(404).json({
                status: 'error',
                message: 'No existen favoritos'
            })
        }

        return res.status(200).json({
            status: 'success',
            message: 'Aqui tienes el listado de favoritos',
            users
        })

    } catch (error) {
        return res.status(400).json({
            status: 'error',
            message: 'Error en la consulta'
        })
    }
}

const deleteFav = async (req, res) => {
    const idUser = req.params.id_user
    const idRecruiter = req.params.id_recruiter

    try {

        const user = await User.findByIdAndUpdate({
            _id: idUser
        }, { $pull: { recruiter: idRecruiter } }, { new: true })

        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'No existe el favorito'
            })
        }

        return res.status(200).json({
            status: 'success',
            message: 'Lo has quitado de favoritos de manera satisfactoria',
            user
        })


    } catch (error) {
        return res.status(400).json({
            status: 'error',
            message: 'Error en la consulta'
        })
    }
}

const deleteUser = async (req, res) => {
    const id = req.params.id

    try {

        const user = await User.findByIdAndDelete({
            _id: id
        })

        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'No existe el user',
            })
        }

        return res.status(200).json({
            status: 'success',
            message: 'User eliminado satisfactoriamente',
            user
        })

    } catch (error) {
        return res.status(400).json({
            status: 'error',
            message: 'Error en la consulta' + error.message
        })
    }
}

module.exports = {
    testUser,
    register,
    uploadPdf,
    getPdf,
    uploadVideo,
    getVideo,
    getUsers,
    getUser,
    addToFav,
    getFav,
    deleteFav,
    update,
    deleteUser
}