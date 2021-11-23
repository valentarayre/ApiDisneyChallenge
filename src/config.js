require('dotenv').config()

const config = {
  PORT: process.env.PORT || 3000,
  saltRounds: process.env.saltRounds || 10,
  TOKEN_SECRET: process.env.TOKEN_SECRET || '123'
}

module.exports = config
