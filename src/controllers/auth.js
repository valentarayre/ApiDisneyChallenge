const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const Users = require('../models/User')
const config = require('../config')

module.exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Error: missing parameters ' })
    }

    const passwordHash = await bcrypt.hash(password, config.saltRounds)
    const user = await Users.create({
      name,
      email,
      password: passwordHash
    })

    res.status(201).json({ user })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      msg: 'Error server'
    })
  }
}

module.exports.authUser = async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ message: 'Error: missing parameters ' })
    }

    const user = await Users.findOne({ where: { email } })
    if (user === null) {
      res.status(400).json({ message: 'Email or Password Invalid' })
    }
    const authPassword = user === null
      ? false
      : await bcrypt.compare(password, user.password)

    if (!authPassword) {
      res.status(400).json({ message: 'Email or Password Invalid' })
    }

    const userToken = {
      id: user.id,
      email: user.email
    }

    const token = jwt.sign(userToken, config.TOKEN_SECRET, { expiresIn: '1800s' })

    res.json({ token })

    // res.json({ message: project instanceof Users, name: project.name })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      msg: 'Error server'
    })
  }
}
