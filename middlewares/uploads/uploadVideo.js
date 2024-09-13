const multer = require('multer')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/videos/')
    },
    filename: (req, file, cb) => {
        cb(null, 'video-' + Date.now() + '-' + file.originalname)
    }
})

const uploads = multer({storage})

module.exports = uploads