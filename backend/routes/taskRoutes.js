const express = require('express')
const router = express.Router()

const {
  getTasks,
  createTask,
  getTask,
  deleteTask,
  updateTask,
} = require(`../controllers/taskController`)
const { protect } = require('../middleware/authMiddleware')

router.route('/').post(protect, createTask).get(protect, getTasks)

router
  .route('/:id')
  .get(protect, getTask)
  .delete(protect, deleteTask)
  .put(protect, updateTask)

module.exports = router
