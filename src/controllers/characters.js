const { deletePicture } = require('../middleware/uploadPicture')
const Characters = require('../models/Character')
const { characterSchema, putCharacterSchema } = require('../validator')
const Sequelize = require('sequelize')
const MovieCharacter = require('../models/MovieCharacter')
const Op = Sequelize.Op

module.exports.getCharacters = async (req, res) => {
  if (!(Object.keys(req.query).length === 0)) {
    const { name = '', age = '', idMovie = '' } = req.query
    let search = null
    if (name) {
      search = await Characters.findAll({ where: { name: { [Op.like]: `%${name}%` } } })
    } else if (age) {
      search = await Characters.findAll({ where: { age: req.query.age } })
    } else if (idMovie) {
      const movie = await MovieCharacter.findAll({ where: { movieId: req.query.idMovie } })
      if (movie.length === 0) search = { message: 'No Movies' }
      else {
        for await (const x of movie) {
          const character = await Characters.findOne({ where: { id: x.dataValues.characterId } })
          search
            ? search.push(character.dataValues)
            : search = [character.dataValues]
        }
      }
    } else { res.status(400).json('No Querry') }
    res.json(search)
  } else {
    const characters = await Characters.findAll({ attributes: ['image', 'name'] })

    res.json({ ...characters })
  }
}

module.exports.getCharacterId = async (req, res) => {
  const { id } = req.params

  const characterID = await Characters.findByPk(id)

  const moviesCharacter = await MovieCharacter.findAll({
    where: { CharacterId: id }
  })

  if (characterID) {
    if (!moviesCharacter) res.json({ ...characterID.dataValues })
    else {
      res.json({ characterID, moviesCharacter })
    }
  } else {
    res.status(400).json({
      msg: `Character for id ${id} does not exist in DB`
    })
  }
}

module.exports.postCharacter = async (req, res) => {
  const validReq = characterSchema.validate(req.body)
  if (!req.file) return res.status(400).json({ message: 'Invalid request, image' })
  const { filename } = req.file
  const { value, error } = validReq
  if (error) {
    deletePicture(filename)
    res.status(400).json({ message: 'Invalid request', error: error.message })
  } else {
    const { name, age, weight, history } = value
    const nameUnique = await Characters.findOne({ where: { name } })
    if (!(nameUnique === null)) {
      deletePicture(filename)
      res.status(400).json({ message: 'Name Invalid: the name has to be unique' })
    } else {
      const character = await Characters.create({
        image: filename,
        name,
        age,
        weight,
        history
      })
      if (character) res.status(200).json({ ...character.dataValues })
      else res.status(500).json({ msg: 'Error server' })
    }
  }
}

module.exports.putCharacter = async (req, res) => {
  try {
    const { id } = req.params
    const character = await Characters.findByPk(id)
    if (!character) return res.status(404).json({ message: 'Character no found' })

    const validReq = putCharacterSchema.validate(req.body)

    const { name = '', age = '', weight = '', history = '' } = validReq.value

    let filename = null
    const imageNameBackup = character.image
    if (req.file) filename = req.file.filename

    const newCharacter = {
      image: filename || character.image,
      name: name || character.name,
      age: age || character.age,
      weight: weight || character.weight,
      history: history || character.history
    }

    const characterUpdate = await character.update(newCharacter)
    if (characterUpdate) {
      if (req.file) await deletePicture(imageNameBackup)
      res.json(characterUpdate)
    } else res.status(400)
  } catch (error) {
    res.status(500).json(error)
  }
}
module.exports.deleteCharacter = async (req, res) => {
  try {
    const { id } = req.params
    const characterID = await Characters.findByPk(id)

    if (!characterID) {
      return res.status(404).send(`El Character (${id}) not found`)
    } else {
      MovieCharacter.destroy({ where: { characterId: id } })

      await deletePicture(characterID.image)

      await characterID.destroy()

      res.json({ ...characterID.dataValues })
    }
  } catch (error) {
    res.status(500).json(error)
  }
}
