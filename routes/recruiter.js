const express = require('express')
const RecruiterController = require('../controllers/recruiter')
const check = require('../middlewares/jwt/auth')
const uploadAvatar = require('../middlewares/uploads/uploadAvatar')

const router = express.Router()

router.get('/test-recruiter', RecruiterController.testRecruiter)
router.post('/register', RecruiterController.register)
router.post('/login', RecruiterController.login)
router.post('/upload-avatar/:id', [check.auth, uploadAvatar.single('file0')], RecruiterController.uploadAvatar)
router.get('/get-avatar/:file', check.auth, RecruiterController.getAvatar)
router.get('/get-recruiter/:id', check.auth, RecruiterController.getRecruiter)
router.put('/update/:id', check.auth, RecruiterController.update)
router.get('/get-recruiters', check.auth, RecruiterController.getRecruiters)
router.delete('/delete-recruiter/:id', check.auth, RecruiterController.deleteRecruiter)

module.exports = router