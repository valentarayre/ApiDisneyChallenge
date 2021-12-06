const db = require('../db/create')
require('./User')
require('./Character')
require('./Movie')
require('./Genre')

db.sync({ force: false }).then(function () {
  console.log('Database Configured')
})
