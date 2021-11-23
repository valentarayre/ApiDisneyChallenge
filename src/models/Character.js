const { DataTypes } = require('sequelize')
const db = require('../db/create')

const Character = db.define('Character', {
  image: {
    type: DataTypes.STRING
    // allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  age: {
    type: DataTypes.NUMBER,
    allowNull: false
  },
  weight: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  history: {
    type: DataTypes.STRING,
    allowNull: false
  }
})

module.exports = Character
