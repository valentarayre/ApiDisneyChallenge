const { Router } = require('express')
const { registerUser, authUser } = require('../controllers/auth')

const router = Router()

router.get('/', (req, res) => {
  res.json({ message: 'hello word' })
})

router.post('/auth/register', registerUser)
router.post('/auth/login', authUser)

module.exports = router
