const MovieCharacters = require('../models/MovieCharacter')
const Movies = require('../models/Movie')
const { movieCharacterSchema } = require('../validator')
const Character = require('../models/Character')

module.exports.getMoviesCharacters = async (req, res) => {
  const MovieCharacter = await MovieCharacters.findAll()
  res.json({ ...MovieCharacter })
}

module.exports.postMovieCharacter = async (req, res) => {
  const validReq = movieCharacterSchema.validate(req.body)
  const { value, error } = validReq

  if (error) {
    res.status(400).json({ message: 'Invalid request', error: error.message })
  } else {
    const { movieId, characterId } = value
    const movie = await Movies.findOne({ where: { id: movieId } })
    const character = await Character.findOne({ where: { id: characterId } })

    if ((movie === null)) {
      res.status(400).json({ message: 'Movie, invalid' })
    } else if ((character === null)) {
      res.status(400).json({ message: 'Character, invalid' })
    } else {
      try {
        const realation = await MovieCharacters.create({ movieId, characterId })
        if (realation) {
          res.status(200).json({ ...realation.dataValues })
        } else {
          res.status(500).json({ msg: 'Error server' })
        }
      } catch (error) {
        res.status(500).json({ error })
      }
    }
  }
}

module.exports.deleteMovieCharacter = async (req, res) => {
  try {
    const { id } = req.params
    const realationID = await MovieCharacters.findByPk(id)

    if (!realationID) {
      return res.status(404).json({ message: `El realation (${id}) not found` })
    } else {
      await realationID.destroy()

      res.json({ ...realationID.dataValues })
    }
  } catch (error) {
    res.status(500).json(error)
  }
}
