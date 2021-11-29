const path = require('path')
const multer = require('multer')
const uuid = require('uuid')
const { unlink } = require('fs-extra')

const storage = multer.diskStorage({
  destination: './src/img/uploads',
  filename: (req, file, cb, filename) => {
    cb(null, uuid.v4() + path.extname(file.originalname))
  }
})
const upload = multer({
  storage: storage,
  fileFilter: function (req, file, callback) {
    const ext = path.extname(file.originalname)
    if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
      return callback(new Error('Only images are allowed'))
    }
    callback(null, true)
  }
}).single('image')

const deletePicture = async (image) => {
  try {
    await unlink(path.resolve('./src/img/uploads/' + image))
  } catch (error) {
    console.error(new Error('No found Image'))
  }
}

module.exports = { upload, deletePicture }
