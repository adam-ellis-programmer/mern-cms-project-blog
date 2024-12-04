// CRUN FUNCTIONALITY
const asyncHandler = require('express-async-handler')

const User = require('../models/userModel')
const Task = require('../models/taskModel')

// @desc    create new task
// @route   GET/api/tasks
// @access  private
const createTask = asyncHandler(async (req, res) => {
  // time is still being created on the client and sent through req.body
  const { taskText, important, date, time } = req.body

  if (!taskText) {
    res.status(400)
    throw new Error('please enter a task from backend')
  }

  // get user using id in the JWT
  const user = User.findById(req.user.id)
  if (!user) {
    // 401 = bad req
    res.status(401)
    throw new Error('No user found !')
  }

  const task = await Task.create({
    userID: req.user.id,
    taskText,
    important,
    date,
    time,
  })
  res.status(201).json(task)
})

// @desc    Get all tasks
// @route   GET/api/tasks
// @access  private
const getTasks = asyncHandler(async (req, res) => {
  // Get user using the ID in the JWT
  const user = await User.findById(req.user.id)
  console.log('USER =======>', user)
  if (!user) {
    res.status(401)
    throw new Error('User not found')
  }

  const tasks = await Task.find({ userID: req.user.id }) // <-- getting the users records by the JWT see line 12 -- find by the user

  console.log(tasks)
  res.status(200).json(tasks)
})

// @desc    Get user task
// @route   GET/api/tasks/:id
// @access  private
const getTask = asyncHandler(async (req, res) => {
  // Get user using the ID in the JWT
  const user = await User.findById(req.user.id)

  if (!user) {
    res.status(401)
    throw new Error('User not found')
  }
  // comes in by the url so we use req.params
  const task = await Task.findById(req.params.id) // <-- getting the users records by the JWT see line 12 -- find by the user

  // check to see if we have a ticket singular
  if (!task) {
    res.status(404)
    throw new Error('ticket not found')
  }

  // it has to be that users task - as we do not want people to get othrer tasks
  // req.user.id is the logged in user
  if (task.userID.toString() !== req.user.id) {
    res.status(401)
    throw new Error('401 you are not authorized')
  }

  console.log(task)
  res.status(200).json(task)
})

// @desc    Delete task
// @route   DELETE/api/tasks/:id
// @access  private
const deleteTask = asyncHandler(async (req, res) => {
  // Get user using the ID in the JWT
  const user = await User.findById(req.user.id)

  if (!user) {
    res.status(401)
    throw new Error('User not found')
  }
  // comes in by the url so we use req.params
  const task = await Task.findById(req.params.id) // <-- getting the users records by the JWT see line 12 -- find by the user

  // check to see if we have a ticket singular
  if (!task) {
    res.status(404)
    throw new Error('ticket not found')
  }

  // it has to be that users task - as we do not want people to get othrer tasks
  // req.user.id is the logged in user
  if (task.userID.toString() !== req.user.id) {
    res.status(401)
    throw new Error('401 you are not authorized')
  }

  await task.deleteOne()

  console.log(task)
  res.status(200).json({ msg: 'task deleted' })
})

// do the checks
// @desc    update task
// @route   PUT/api/tasks/:id
// @access  private
const updateTask = asyncHandler(async (req, res) => {
  // Get user using the ID in the JWT
  const user = await User.findById(req.user.id)

  if (!user) {
    res.status(401)
    throw new Error('User not found')
  }
  // comes in by the url so we use req.params
  const task = await Task.findById(req.params.id) // <-- getting the users records by the JWT see line 12 -- find by the user

  // check to see if we have a ticket singular
  if (!task) {
    res.status(404)
    throw new Error('ticket not found')
  }

  // it has to be that users task - as we do not want people to get othrer tasks
  // req.user.id is the logged in user
  if (task.userID.toString() !== req.user.id) {
    res.status(401)
    throw new Error('401 you are not authorized')
  }

  const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  })

  console.log(updatedTask)
  res.status(200).json(updatedTask)
})

module.exports = {
  createTask,
  getTasks,
  getTask,
  deleteTask,
  updateTask,
}
