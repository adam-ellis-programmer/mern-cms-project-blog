const asyncHandler = require('express-async-handler')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const UserModel = require('../models/userModel')

// @desc get  user blog
// @route GET api/blogs/:id
// @ access private
const getUserAdmin = asyncHandler(async (req, res) => {
  const loggedInUserID = req.user.id
  const loggedInUser = await UserModel.findById(loggedInUserID)

  if (!loggedInUser) {
    res.status(401)
    throw new Error('User Not Found!')
  }

  const user = await UserModel.findById(req.params.id)

  if (!user) {
    res.status(404)
    throw new Error('No user found')
  }

  // check if is admin and !suspended
  if (loggedInUser.isAdmin === false) {
    throw new Error(
      'You must be admin to view this document please contact your admin support!'
    )
  }

  if (loggedInUser.isSuspended === true) {
    res.status(401)
    throw new Error('You are currently suspended please contact your admin support!')
  }

  res.status(200).json(user)
})

// @desc update  user blog
// @route PUT api/blogs/:id
// @ access private
const updateUserAdmin = asyncHandler(async (req, res) => {
  const loggedInUserID = req.user.id
  const loggedInUser = await UserModel.findById(loggedInUserID)

  // if no logged in user
  if (!loggedInUser) {
    res.status(401)
    throw new Error('User Not Found!')
  }

  // check if is admin and !suspended
  if (loggedInUser.isAdmin === false || loggedInUser.isSuspended === true) {
    throw new Error('You must be admin and not suspended to view this document backend')
  }

  // id set by :id in the routes
  const userToUpdateID = req.params.id

  // get the user to update -> id is the user id
  const user = await UserModel.findById(userToUpdateID)

  if (!user) {
    res.status(404)
    throw new Error('user not found')
  }

  const updatedUser = await UserModel.findByIdAndUpdate(userToUpdateID, req.body, {
    new: true,
  })

  res.status(200).json(updatedUser)
})

// @desc get  user blog
// @route GET api/blogs/:id
// @ access private
const deleteUserAdmin = asyncHandler(async (req, res) => {
  const loggedInUserID = req.user.id
  const loggedInUser = await UserModel.findById(loggedInUserID)

  if (!loggedInUser) {
    res.status(401)
    throw new Error('User Not Found!')
  }

  const user = await UserModel.findById(req.params.id)

  if (!user) {
    res.status(404)
    throw new Error('No user found')
  }

  // check if is admin and !suspended
  if (loggedInUser.isAdmin === false || loggedInUser.isSuspended === true) {
    throw new Error('You must be admin and not suspended to view this document')
  }

  await user.deleteOne()
  res.status(200).json({ deleted: true })
})

module.exports = {
  getUserAdmin,
  updateUserAdmin,
  deleteUserAdmin,
}
