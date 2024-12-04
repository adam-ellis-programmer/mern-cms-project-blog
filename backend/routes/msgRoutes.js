const express = require('express')
const router = express.Router()
const { newMsg, getMessages, deleteMsg } = require('../controllers/msgCotroller')
const { protect } = require('../middleware/authMiddleware')

// send message
router.route('/').post(newMsg).get(protect, getMessages)
// delete message
router.route('/:id').delete(protect, deleteMsg)

module.exports = router
