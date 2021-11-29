const Sequelize = require('sequelize')

const db = new Sequelize({
  dialect: 'sqlite',
  storage: './src/database.sqlite3',
  logging: false
})

module.exports = db
