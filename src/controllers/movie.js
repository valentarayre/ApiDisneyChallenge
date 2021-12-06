const { deletePicture } = require('../middleware/uploadPicture')
const Genre = require('../models/Genre')
const Movies = require('../models/Movie')
const MovieCharacter = require('../models/MovieCharacter')
const { movieSchema, putMovieSchema } = require('../validator')

module.exports.getMovies = async (req, res) => {
  const movie = await Movies.findAll({ attributes: ['image', 'title', 'creationDate'] })
  res.json({ ...movie })
}

module.exports.getMovieId = async (req, res) => {
  const { id } = req.params

  const movie = await Movies.findByPk(id)
  const moviesCharacter = await MovieCharacter.findAll({
    where: { MovieId: id }
  })

  if (movie) {
    if (!moviesCharacter) res.json({ ...movie.dataValues })
    else { res.json({ movie, moviesCharacter }) }
  } else {
    res.status(400).json({
      msg: `Movie for id ${id} does not exist in DB`
    })
  }
}

module.exports.postMovie = async (req, res) => {
  const validReq = movieSchema.validate(req.body)
  if (!req.file) return res.status(400).json({ message: 'Invalid request, image' })
  const { filename } = req.file
  const { value, error } = validReq
  if (error) {
    deletePicture(filename)
    res.status(400).json({ message: 'Invalid request', error: error.message })
  } else {
    const { title, creationDate, score, GenreId } = value
    const titleUnique = await Movies.findOne({ where: { title } })
    const GenreIdFind = await Genre.findOne({ where: { id: GenreId } })

    if (!(titleUnique === null)) {
      deletePicture(filename)
      res.status(400).json({ message: 'Title Invalid: the title has to be unique' })
    } else if ((GenreIdFind === null)) {
      deletePicture(filename)
      res.status(400).json({ message: 'Genre Invalid' })
    } else {
      try {
        const numGenreId = parseInt(GenreId)
        const movie = await Movies.create({ image: filename, title, creationDate, score, GenreId: numGenreId })
        if (movie) {
          res.status(200).json({ movie })
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

module.exports.deleteMovie = async (req, res) => {
  try {
    const { id } = req.params
    const MovieID = await Movies.findByPk(id)

    if (!MovieID) {
      return res.status(404).send(`El Movie (${id}) not found`)
    }
    MovieCharacter.destroy({ where: { movieID: id } })

    await deletePicture(MovieID.image)
    await MovieID.destroy()

    res.json({ ...MovieID.dataValues })
  } catch (error) {
    res.status(500).json(error)
  }
}

module.exports.putMovie = async (req, res) => {
  try {
    const { id } = req.params
    const Movie = await Movies.findByPk(id)
    if (!Movie) return res.status(404).json({ message: 'Movie no found' })

    const validReq = putMovieSchema.validate(req.body)

    const { title = '', creationDate = '', score = '' } = validReq.value

    let filename = null
    const imageNameBackup = Movie.image
    if (req.file) filename = req.file.filename

    const newMovie = {
      image: filename || Movie.image,
      title: title || Movie.title,
      creationDate: creationDate || Movie.creationDate,
      score: score || Movie.score
    }

    const MovieUpdate = await Movie.update(newMovie)
    if (MovieUpdate) {
      if (req.file) await deletePicture(imageNameBackup)
      res.json(MovieUpdate)
    } else res.status(400)
  } catch (error) {
    res.status(500).json(error)
  }
}
