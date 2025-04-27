const express = require('express')
const UserController = require('../controllers/user')

const check = require('../middlewares/jwt/auth')
const uploadsCv = require('../middlewares/uploads/uploadCv')
const uploadsVideo = require('../middlewares/uploads/uploadVideo')

const router = express.Router()

router.get('/test-user', UserController.testUser)
router.post('/register', check.auth, UserController.register)
router.post('/upload-pdf/:id', [check.auth, uploadsCv.single('file0')], UserController.uploadPdf)
router.get('/get-pdf/:file', check.auth, UserController.getPdf)
router.post('/upload-video/:id', [check.auth, uploadsVideo.single('file0')], UserController.uploadVideo)
router.get('/get-video/:file', check.auth, UserController.getVideo)
router.get('/get-users', check.auth, UserController.getUsers)
router.get('/get-user/:id', check.auth, UserController.getUser)
router.put('/add-fav/:id_recruiter/:id_user', check.auth, UserController.addToFav)
router.get('/get-fav/:id', check.auth, UserController.getFav)
router.put('/delete-fav/:id_recruiter/:id_user', check.auth, UserController.deleteFav)
router.put('/update-user/:id', check.auth, UserController.update)
router.delete('/delete-user/:id', check.auth, UserController.deleteUser)

module.exports = router