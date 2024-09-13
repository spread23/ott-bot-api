const Offer = require('../models/offer')

const testOffer = (req, res) => {
    return res.status(200).json({
        status: 'success',
        message: 'Endpoint de test de offer'
    })
}

const createOffer = async (req, res) => {
    const params = req.body
    const id = req.params.id

    if (!params.title || !params.description || !params.area || !params.experience || !params.availability || !params.salary || !params.languajes) {
        return res.status(404).json({
            status: 'error',
            message: 'Faltan parametros'
        })
    }

    params.recruiter = id

    const offerToSave = new Offer(params)
    const offerStorage = await offerToSave.save()

    return res.status(200).json({
        status: 'success',
        message: 'Oferta creada de manera exitosa',
        offer: offerStorage
    })
}

const getOffers = async (req, res) => {
    const id = req.params.id

    try {

        const offers = await Offer.find({
            recruiter: id
        }).populate('user')

        if (!offers || offers.length <= 0) {
            return res.status(404).json({
                status: 'error',
                message: 'No has creado ofertas aun'
            })
        }

        return res.status(200).json({
            status: 'success',
            message: 'Get ofertas',
            offers
        })

    } catch (error) {
        return res.status(400).json({
            status: 'error',
            message: 'Error en la consulta'
        })
    }
}

const getOffer = async (req, res) => {
    const idRecruiter = req.params.id_recruiter
    const idOffer = req.params.id_offer

    try {

        const offer = await Offer.findOne({
            $and: [
                { recruiter: idRecruiter },
                { _id: idOffer }
            ]
        })

        if (!offer) {
            return res.status(404).json({
                status: 'error',
                message: 'La oferta no existe'
            })
        }

        return res.status(200).json({
            status: 'success',
            message: 'Get offer',
            offer
        })

    } catch (error) {
        return res.status(400).json({
            status: 'error',
            message: 'Error en la consulta'
        })
    }
}

const deleteOffer = async (req, res) => {
    const id = req.params.id

    try {

        const offer = await Offer.findByIdAndDelete({
            _id: id
        })

        if (!offer) {
            return res.status(404).json({
                status: 'error',
                message: 'No existe la oferta',
            })
        }

        return res.status(200).json({
            status: 'success',
            message: 'Oferta eliminada satisfactoriamente',
            offer
        })

    } catch (error) {
        return res.status(400).json({
            status: 'error',
            message: 'Error en la consulta' + error.message
        })
    }
}

const postOffer = async (req, res) => {
    const idOffer = req.params.id_offer
    const idUser = req.params.id_user

    try {

        const offer = await Offer.findByIdAndUpdate({
            _id: idOffer
        }, { $addToSet: { user: idUser } }, { new: true })

        if (!offer) {
            return res.status(404).json({
                status: 'error',
                message: 'No existe la oferta'
            })
        }

        return res.status(200).json({
            status: 'success',
            message: 'Postulaste a la oferta correctamente',
            offer
        })

    } catch (error) {
        return res.status(400).json({
            status: 'error',
            message: 'Error en la consulta' + error.message
        })
    }
}

const deletePost = async (req, res) => {
    const idOffer = req.params.id_offer
    const idUser = req.params.id_user

    try {

        const offer = await Offer.findByIdAndUpdate({
            _id: idOffer
        }, { $pull: { user: idUser } }, { new: true })

        if (!offer) {
            return res.status(404).json({
                status: 'error',
                message: 'No existe la oferta'
            })
        }

        return res.status(200).json({
            status: 'success',
            message: 'Has eliminado el post correctamente',
            offer
        })

    } catch (error) {
        return res.status(400).json({
            status: 'error',
            message: 'Error en la consulta'
        })
    }
}


module.exports = {
    testOffer,
    createOffer,
    getOffers,
    getOffer,
    deleteOffer,
    postOffer,
    deletePost
}