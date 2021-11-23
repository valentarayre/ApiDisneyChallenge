const db = require('./create')
require('../models/User')
require('../models/Character')
require('../models/Movie')
require('../models/MovieCharacter')

db.sync({ force: false }).then(function () {
  console.log('Database Configured')
})
