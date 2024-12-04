const { upload } = require('../middleware/multerMiddleware')
const express = require('express')
const router = express.Router()

const {
  getBlogs,
  createBlog,
  getBlog,
  updateBlog,
  deleteBlog,
  deleteBlogAdmin,
  deleteBlogImage,
  updateBlogImage,
  uploadBulkImages,
  deleteBulkImages,
} = require('../controllers/blogController')
const { protect } = require('../middleware/authMiddleware')

// for multer uploads and functionality
const uploadFields = upload.fields([
  { name: 'heroImage', maxCount: 1 },
  { name: 'images', maxCount: 10 },
])
// get all and post one
router.route('/').get(protect, getBlogs).post(uploadFields, protect, createBlog)
// admin delete
router.route('/admin-delete/:id').delete(protect, deleteBlogAdmin)
// delete img
router.route('/delete-img').put(protect, deleteBlogImage)
// update img
router.route('/update-img').put(upload.single('image'), protect, updateBlogImage)
// upload images bulk
router.route('/update-imgs/bulk').put(upload.array('images'), protect, uploadBulkImages)
// delete bulk for when deleting blog 
router.route('/delete-imgs/bulk').put(protect, deleteBulkImages)

router
  .route('/:id')
  .get(protect, getBlog)
  .delete(protect, deleteBlog)
  .put(protect, updateBlog)

module.exports = router
