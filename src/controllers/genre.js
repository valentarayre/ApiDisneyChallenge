const { deletePicture } = require('../middleware/uploadPicture')
const Genres = require('../models/Genre')
const Movie = require('../models/Movie')
const { genreSchema } = require('../validator')

module.exports.getGenres = async (req, res) => {
  const genre = await Genres.findAll()
  res.json({ ...genre })
}

module.exports.postGenre = async (req, res) => {
  const validReq = genreSchema.validate(req.body)
  if (!req.file) return res.status(400).json({ message: 'Invalid request, image' })
  const { filename } = req.file
  const { value, error } = validReq
  if (error) {
    deletePicture(filename)
    res.status(400).json({ message: 'Invalid request', error: error.message })
  } else {
    const { name } = value
    const nameUnique = await Genres.findOne({ where: { name } })

    if (!(nameUnique === null)) {
      deletePicture(filename)
      res.status(400).json({ message: 'Name Invalid: the name has to be unique' })
    } else {
      try {
        const genre = await Genres.create({ image: filename, name })
        if (genre) {
          res.status(200).json({ ...genre.dataValues })
        } else {
          res.status(500).json({ msg: 'Error server' })
        }
      } catch (error) {
        deletePicture(filename)
        res.status(500).json({ error })
      }
    }
  }
}

module.exports.deleteGenre = async (req, res) => {
  try {
    const { id } = req.params
    const genreID = await Genres.findByPk(id)
    const genreIDMovies = await Movie.findAll({ where: { id } })
    if (!genreID) {
      return res.status(404).json({ message: `El genre (${id}) not found` })
    } else if (!(genreIDMovies.length === 0)) {
      return res.status(400).json({ message: 'There are associated movies' })
    } else {
      await deletePicture(genreID.image)
      await genreID.destroy()

      res.json({ ...genreID.dataValues })
    }
  } catch (error) {
    res.status(500).json(error)
  }
}
