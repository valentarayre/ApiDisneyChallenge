const jwt = require('jsonwebtoken')
const config = require('../config')

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) return res.status(401).json({ error: 'Access denied' })
  try {
    const verified = jwt.verify(token, config.TOKEN_SECRET)
    req.user = verified
    next() // continuamos
  } catch (error) {
    res.status(400).json({ error: 'token is not valid' })
  }
}

module.exports = verifyToken
