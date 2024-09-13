const multer = require('multer')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/cvs/')
    },
    filename: (req, file, cb) => {
        cb(null, 'cv-' + Date.now() + '-' + file.originalname)
    }
})

const uploads = multer({storage})

module.exports = uploads