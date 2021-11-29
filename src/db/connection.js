const db = require('./create')
require('../models/User')
require('../models/Character')
require('../models/Movie')
require('../models/Genre')

db.sync({ force: false }).then(function () {
  console.log('Database Configured')
})
