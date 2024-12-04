const { upload } = require('../middleware/multerMiddleware')
const express = require('express')
const router = express.Router()
const {
  getAllBlogsAdmin,
  updateBlogAdmin,
  getBlogAdmin,
  deleteBlogAdmin,
  createBlogAsAdmin,
} = require('../controllers/blogController')

const { createUserAdmin, getAllUsersAdmin } = require('../controllers/userController')
const {
  getUserAdmin,
  updateUserAdmin,
  deleteUserAdmin,

} = require('../controllers/adminController')
const { protect } = require('../middleware/authMiddleware')

const uploadFields = upload.fields([
  { name: 'heroImage', maxCount: 1 },
  { name: 'images', maxCount: 10 },
])

router.route('/').get(protect, getAllBlogsAdmin)

// get all users as admin
router.route('/users').get(protect, getAllUsersAdmin)

// create new users as admin
router.route('/create').post(protect, createUserAdmin)

// create new blog as admin {for user}
router.route('/create/user-blog/admin').post(uploadFields, protect, createBlogAsAdmin)


router
  .route('/users/:id')
  .get(protect, getUserAdmin)
  .put(protect, updateUserAdmin)
  .delete(protect, deleteUserAdmin)

router 
  .route('/:id')
  .put(protect, updateBlogAdmin)
  .get(protect, getBlogAdmin)
  .delete(protect, deleteBlogAdmin)
module.exports = router
