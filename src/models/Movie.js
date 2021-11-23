const { DataTypes } = require('sequelize')
const db = require('../db/create')

const Movie = db.define('Movie', {
  image: {
    type: DataTypes.STRING
    // allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
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
  }
})

module.exports = Movie
