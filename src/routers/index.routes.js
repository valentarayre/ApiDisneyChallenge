const { Router } = require('express')

const router = Router()

router.get('/', (req, res) => {
  res.json({ message: 'hello word' })
})

module.exports = router
