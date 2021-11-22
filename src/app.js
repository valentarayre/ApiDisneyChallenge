const express = require('express')
const indexRouter = require('./routers/index.routes')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())
app.use(indexRouter)

module.exports = app
