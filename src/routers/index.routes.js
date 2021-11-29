const { Router } = require('express')
const { registerUser, authUser } = require('../controllers/auth')
const { getCharacters, getCharacterId, postCharacter, putCharacter, deleteCharacter } = require('../controllers/characters')
const { getMovies, getMovieId, postMovie, deleteMovie, putMovie } = require('../controllers/movie')
const { upload } = require('../middleware/uploadPicture')
const verifyToken = require('../middleware/validate-token')

const router = Router()

router.post('/auth/register', registerUser)
router.post('/auth/login', authUser)

router.use(verifyToken)
router.get('/movies', getMovies)
router.get('/movie/:id', getMovieId)
router.post('/movie', upload, postMovie)
router.put('/movie/:id', upload, putMovie)
router.delete('/movie/:id', upload, deleteMovie)

router.get('/characters', getCharacters)
router.get('/character/:id', getCharacterId)
router.post('/character', upload, postCharacter)
router.put('/character/:id', upload, putCharacter)
router.delete('/character/:id', deleteCharacter)

module.exports = router
