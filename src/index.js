// import app from './app.js'
const app = require('./app')
const config = require('./config')

app.listen(config.PORT)

console.log('Server on port ', config.PORT)
