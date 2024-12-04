const asyncHandler = require('express-async-handler')
const MsgModel = require('../models/msgModel')
const UserModel = require('../models/userModel')

const newMsg = asyncHandler(async (req, res) => {
  const {
    about,
    contactEmail,
    contactPhone,
    date,
    email,
    firstName,
    lastName,
    fullName,
    mailingList,
    msg,
    phone,
    terms,
    time,
  } = req.body

  if (!firstName || !lastName || !email || !msg) {
    throw new Error('please enter name, email and message')
  }

  if (!terms) {
    throw new Error('Accept Terms!')
  }

  if (!about) {
    throw new Error('What is this relating to?')
  }

  const newSignUp = await MsgModel.create({
    about,
    contactEmail,
    contactPhone,
    date,
    email,
    firstName,
    lastName,
    fullName,
    mailingList,
    msg,
    phone,
    terms,
    time,
  })

  res.status(201).json({ msg: 'successfully sent message' })
})

// get all messages for admin -- protected
const getMessages = asyncHandler(async (req, res) => {
  const userID = req.user._id
  console.log('USER ID 88---', userID)
  const loggedInUser = await UserModel.findById(userID)

  if (!loggedInUser) {
    res.status(401)
    throw new Error('You are not authorized to view this area')
  }

  if (!loggedInUser.isAdmin) {
    res.status(401)
    throw new Error('You must be admin to view these messages')
  }

  if (loggedInUser.isSuspended) {
    res.status(401)
    throw new Error('You are suspended and cannot view these messages')
  }

  if (loggedInUser) {
    const allMsgs = await MsgModel.find()
    res.status(200).json(allMsgs)
  }
})

// get all messages for admin PROTECTED
const deleteMsg = asyncHandler(async (req, res) => {
  const userID = req.user._id
  const user = await UserModel.findById(userID)

  if (!user) {
    res.status(404)
    throw new Error('No user found')
  } 

  if (!user.isAdmin) {
    res.status(401) 
    throw new Error('You must be admin to delete this message!')
  }

  if (user.isSuspended) {
    res.status(401)
    throw new Error('You are suspended and cannnot delete theis message')
  }

  const message = await MsgModel.findById(req.params.id)

  if (!message) {
    res.status(404)
    throw new Error('No message found')
  }

  await message.deleteOne()
  res.status(200).json({ msg: 'delete successful' })
})

module.exports = { newMsg, getMessages, deleteMsg }
