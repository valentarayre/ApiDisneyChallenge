const { DataTypes } = require('sequelize')
const db = require('../db/create')
const GenreId = require('./Genre')

const Movie = db.define('Movie', {
  image: {
    type: DataTypes.STRING,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  creationDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  score: {
    type: DataTypes.NUMBER,
    allowNull: false,
    validate: {
      min: 0,
      max: 4
    }
  },
  GenreId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
})

Movie.belongsTo(GenreId, { foreignKey: 'GenreId' })
module.exports = Movie
