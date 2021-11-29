const { DataTypes } = require('sequelize')
const db = require('../db/create')
const GenreId = require('./Genre')
const Movies = require('./Movie')

const GenreMovie = db.define('GenreMovie', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  CharacterId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  GenreId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
})
GenreMovie.belongsTo(GenreId, {
  foreignKey: 'GenreId'
})
GenreMovie.belongsTo(Movies, {
  foreignKey: 'MoviesId'
})
module.exports = GenreMovie
