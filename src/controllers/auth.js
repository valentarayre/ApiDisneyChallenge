const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const Users = require('../models/User')
const config = require('../config')
const { registerSchema, loginSchema } = require('../validator')

module.exports.registerUser = async (req, res) => {
  const validReq = registerSchema.validate(req.body)
  const { value, error } = validReq
  if (error) {
    res.status(400).json({ message: 'Invalid request' })
  } else {
    const { name, email, password } = value

    const emailUnique = await Users.findOne({ where: { email } })
    if (!(emailUnique === null)) {
      res.status(400).json({ message: 'Email Invalid' })
    } else {
      const passwordHash = await bcrypt.hash(password, config.saltRounds)
      const user = await Users.create({
        name,
        email,
        password: passwordHash
      })

      res.status(201).json({ user })
    }
  }
}

module.exports.authUser = async (req, res) => {
  const validReq = loginSchema.validate(req.body)
  const { value, error } = validReq

  if (error) {
    res.status(400).json({ message: 'Invalid request' })
  } else {
    const { email, password } = value
    const user = await Users.findOne({ where: { email } })
    if (user === null) {
      res.status(400).json({ message: 'Email or Password Invalid' })
    }
    const authPassword = user === null
      ? false
      : await bcrypt.compare(password, user.password)

    if (!authPassword) {
      res.status(400).json({ message: 'Email or Password Invalid' })
    } else {
      const userToken = {
        id: user.id,
        email: user.email
      }

      const token = jwt.sign(userToken, config.TOKEN_SECRET)

      res.header('auth-token', token).json({
        error: null,
        data: { token }
      })
    }
  }
}
