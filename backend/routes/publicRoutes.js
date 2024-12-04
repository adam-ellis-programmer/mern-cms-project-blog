const express = require('express')
const router = express.Router()

const {
  getPublicBlogs,
  getPublicBlog,
  updatePublicBlog,
} = require('../controllers/blogController')
const { protect } = require('../middleware/authMiddleware')

router.route('/blogs').get(getPublicBlogs)
router.route('/blogs/:id').get(getPublicBlog).put(updatePublicBlog)

module.exports = router
