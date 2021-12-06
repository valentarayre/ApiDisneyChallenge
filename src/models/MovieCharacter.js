const { DataTypes } = require('sequelize')
const db = require('../db/create')
const Character = require('./Character')
const Movie = require('./Movie')

const MovieCharacter = db.define('MovieCharacter', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  movieId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  characterId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
})
MovieCharacter.belongsTo(Character, {
  foreignKey: 'characterId'
})
MovieCharacter.belongsTo(Movie, {
  foreignKey: 'movieId'
})
module.exports = MovieCharacter
