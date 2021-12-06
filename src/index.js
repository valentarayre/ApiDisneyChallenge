const app = require('./app')
const config = require('./config')
const db = require('./db/create')
require('./models/index')

app.listen(config.PORT)

console.log('Server on port ', config.PORT)
db.authenticate().then(() => {
  console.log('Connection has been established successfully.')
})
  .catch(err => {
    console.error('Unable to connect to the database:', err)
  })
