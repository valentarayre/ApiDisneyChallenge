const { DataTypes } = require('sequelize')
const db = require('../db/create')

const Genre = db.define('Genre', {
  image: {
    type: DataTypes.STRING,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
})

module.exports = Genre
