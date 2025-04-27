const express = require('express')
const OfferController = require('../controllers/offer')
const check = require('../middlewares/jwt/auth')

const router = express.Router()

router.get('/test-offer', OfferController.testOffer)
router.post('/create-offer/:id', check.auth, OfferController.createOffer)
router.get('/get-offers/:id', check.auth, OfferController.getOffers)
router.get('/get-offer/:id_recruiter/:id_offer', check.auth, OfferController.getOffer)
router.delete('/delete-offer/:id', check.auth, OfferController.deleteOffer)
router.put('/post-offer/:id_offer/:id_user', check.auth, OfferController.postOffer)
router.put('/delete-post/:id_offer/:id_user', check.auth, OfferController.deletePost)
router.get('/get-just-offers', check.auth, OfferController.getJustOffers)

module.exports = router