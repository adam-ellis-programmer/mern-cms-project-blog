const asyncHandler = require('express-async-handler')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
const BlogModel = require('../models/blogModel')
const TaskModel = require('../models/taskModel')
const userModel = require('../models/userModel')
const passwordBannedList = require('../tempData')
const fs = require('fs') // To delete files
const cloudinary = require('cloudinary').v2

// @desc Register a new user
// @route api/users
// @ access public
const registerUser = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    password2,
    dob,
    day,
    month,
    year,
    terms,
    emailList,
    tier,
  } = req.body

  console.log('year', year)

  if (!terms) {
    res.status(400)
    throw new Error('Please accept the terms and conditions')
  }

  if (!day || !month || !year) {
    res.status(400)
    throw new Error('Please include your full date of birth')
  }

  if (!name || !email || !password) {
    res.status(400)
    throw new Error('Please include all fields')
  }

  if (password !== password2) {
    res.status(400)
    throw new Error('passwords must match ')
  }

  if (!email.includes('@')) {
    res.status(400)
    throw new Error('must be a proper email')
  }

  // find if user allready exist
  const userExists = await User.findOne({ email })
  if (userExists) {
    res.status(400) // <-- client error
    throw new Error('User already exists from server')
  }

  // hash password
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    test: password,
    dob,
    terms,
    emailList,
    tier,
  })

  // if a user has been created return this data to client
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
      test: password,
      test2: '123',
      logins: user.logins,
      dob,
    })
  } else {
    res.status(400)
    throw new Error('Invalid user data')
  }
})

// @desc Login a user
// @route api/users/login
// @ access public
// prettier-ignore
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  if(!email){
    res.status(400)
    throw new Error('please enter an email!')
  }
  if(!password){
    res.status(400)
    throw new Error('please enter a password!')
  }

  const user = await User.findOne({ email })    
  
  if(!user){
    res.status(401)
    throw new Error('No user matches that email address')
  }


  if(user && user.isSuspended === true){
    res.status(401)
    throw new Error('you have been suspended!')
  }

  
  
  if (user && (await bcrypt.compare(password, user.password))) { 
    
    await User.findByIdAndUpdate(user.id, {
       logins: user.logins + 1,
     })  
     const updatedUser = await User.findById(user.id);

    const resData = {
      test: 'sent from auth login!',
      id: user._id,                                             
      name: user.name,
      email: user.email,
      admin: user.isAdmin,
      isSuspended: user.isSuspended,
      isSuperAdmin: user.isSuperAdmin,
      logins: updatedUser.logins,
      token: generateToken(user._id),    
      newLogins: 3,
      dob: user.dob,
      avatar: user.avatar,
    }
    res.status(200).json(resData)                                
    // console.log('hello user',user)         
  } else {                                    
    res.status(401)                           
    throw new Error('Invalid credentials')    
  }
})

// @desc get current user
// @route api/me
// @ access private
const getMe = asyncHandler(async (req, res) => {
  const userID = req.user._id

  const loggedInUser = await User.findById(userID)

  if (!loggedInUser) {
    res.status('No user found!')
    throw new Error('No')
  }

  // check type of
  if (userID.toString() !== loggedInUser._id.toString()) {
    res.status(401)
    throw new Error('You are not authorized')
  }

  // get user blog info
  const blogs = await BlogModel.find({ userID: userID })
  // get user task info
  const tasks = await TaskModel.find({ userID: userID })

  const featuredBlogs = blogs.filter((blog) => blog.featured === true)
  // use a reducer to get all the names of the blog titles

  const user = {
    id: loggedInUser._id,
    name: loggedInUser.name,
    email: loggedInUser.email,
    isAdmin: loggedInUser.isAdmin,
    isSuperAdmin: loggedInUser.isSuperAdmin,
    isSuspended: loggedInUser.isSuspended,
    lastLoginDate: loggedInUser.lastLoginDate,
    lastLoginTime: loggedInUser.lastLoginTime,
    createdAt: loggedInUser.createdAt,
    updatedAt: loggedInUser.updatedAt,
    logins: loggedInUser.logins,
    blogs: blogs.length,
    tasks: tasks.length,
    featuredBlogs: featuredBlogs.length,
    dob: loggedInUser.dob,
    avatar: loggedInUser.avatar,
  }

  res.status(200).json(user)
})

//  get current user to check auth on blog
const getCurrentUSer = asyncHandler(async (req, res) => {
  const userID = req.user._id

  if (req.user.isSuspended === true) {
    res.status(401)
    throw new Error('You are currently suspended and cannot blog at this time')
  }

  const user = {
    id: userID,
    name: req.user.name,
    email: req.user.email,
  }

  if (!user) {
    res.status(400)
    throw new Error('No User found ...')
  }

  return res.status(200).json(user)
})

// change user password
const changePassword = asyncHandler(async (req, res) => {
  const { oldPassWord, newPassWord } = req.body
  const userID = req.user._id
  const loggedInUser = await userModel.findById(userID)

  if (loggedInUser.isSuspended) {
    throw new Error('you are suspended')
  }
  if (!loggedInUser) {
    res.status(404)
    throw new Error('User not found')
  }

  // check the banned password list
  passwordBannedList.forEach((item) => {
    if (item.text === newPassWord) {
      res.status(400)
      throw new Error('password cannot be ' + newPassWord)
    }
  })

  if (!oldPassWord || !newPassWord) {
    res.status(400)
    throw new Error('Please enter old and new passwords')
  }

  if (loggedInUser && !(await bcrypt.compare(oldPassWord, loggedInUser.password))) {
    res.status(401)
    throw new Error('old password is incorrect')
  }

  // hash password
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(newPassWord, salt)

  // only update the password
  const updatedUser = await User.findByIdAndUpdate(loggedInUser.id, {
    password: hashedPassword,
  })

  res.json({ msg: 'password successfully changed!' })
})

// change email address only
const changeEmail = asyncHandler(async (req, res) => {
  const { oldEmail, newEmail, confirmEmail } = req.body
  const loggedInUserID = req.user._id
  const user = await User.findById(loggedInUserID)

  if (user.isSuspended) {
    throw new Error('you are suspended')
  }

  if (!oldEmail || !newEmail || !confirmEmail) {
    res.status(404)
    throw new Error('please include all fields')
  }

  if (!user) {
    res.status(400)
    throw new Error('User not found')
  }

  const loggedInUserEmail = user.email

  if (oldEmail !== loggedInUserEmail) {
    res.status(400)
    throw new Error('the email entered does not match your email')
  }

  if (!newEmail.includes('@')) {
    res.status(400)
    throw new Error('Please use a proper email address')
  }

  if (newEmail !== confirmEmail) {
    res.status(400)
    throw new Error('emails do not match')
  }

  const updatedUser = await User.findByIdAndUpdate(loggedInUserID, {
    email: newEmail,
  })

  res.json({ msg: 'successfully changed to ' + newEmail })
})

// change name only
const changeName = asyncHandler(async (req, res) => {
  const { newName } = req.body

  const loggedInUserID = req.user._id

  const user = await User.findById(loggedInUserID)

  if (user.isSuspended) {
    throw new Error('you are suspended')
  }

  if (!user) {
    res.status(400)
    throw new Error('User not found')
  }
  if (newName === '') {
    res.status(400)
    throw new Error('name must not be empty')
  }

  if (newName.length < 5) {
    res.status(400)
    throw new Error('name length not long enough')
  }

  const updatedUser = await User.findByIdAndUpdate(loggedInUserID, {
    name: newName,
  })

  res.json({ msg: 'name successfully changed to ' + newName })
})

// user self delete
const deleteUser = asyncHandler(async (req, res) => {
  const loggedInUserID = req.user._id
  const userToDeleteId = req.params.id

  const user = await User.findById(loggedInUserID)

  // check if user record matches logged in user
  if (loggedInUserID.toString() !== userToDeleteId) {
    res.status(401)
    throw new Error('This accont is not yours to delete')
  }

  if (user.isSuspended) {
    res.status(401)
    throw new Error(
      "Can't delete your account, you are suspended! Please contact admin support"
    )
  }

  // 2nd check if user record matches logged in user
  if (user._id.toString() !== userToDeleteId) {
    res.status(401)
    throw new Error('This accont is not yours to delete')
  }

  if (!user) {
    res.status(400)
    throw new Error('no user found')
  }

  // delete all records associated with that user
  await BlogModel.deleteMany({ userID: loggedInUserID })
  await TaskModel.deleteMany({ userID: loggedInUserID })
  await user.deleteOne()

  const blogs = await BlogModel.find()

  res.json({
    // send back updated blogs to update state
    msg: 'your account has been successfully deleted! we are sorry to see you leave',
    blogs,
  })
})
// ======== ADMIN ======== //

// create user as admin
const createUserAdmin = asyncHandler(async (req, res) => {
  const { name, email, password, isSuspended, isAdmin } = req.body

  const userID = req.user.id
  const loggedInAdmin = await User.findById(userID)

  if (!loggedInAdmin) {
    res.status(400)
    throw new Error('No logged in user found')
  }

  // check if is admin and not suspended
  if (loggedInAdmin.isAdmin === false || loggedInAdmin.isSuspended === true) {
    res.status(400)
    throw new Error('You do not have permisión to access this area')
  }

  // validation
  if (!name || !email || !password) {
    res.status(400)
    throw new Error('Please include all fields')
  }

  // find if user allready exist
  const userExists = await User.findOne({ email })
  if (userExists) {
    res.status(400) // <-- client error
    throw new Error('User already exists from server')
  }

  // hash password
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
    test: password,
    isSuspended,
    isAdmin,
  })

  // if a user has been created
  if (newUser) {
    res.status(201).json({
      // optinal
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      // not optional
      token: generateToken(newUser._id),
    })
  } else {
    res.status(400)
    throw new Error('Invalid newUser data')
  }
})

// @desc get  user blog
// @route GET api/blogs/:id
// @ access private
const getAllUsersAdmin = asyncHandler(async (req, res) => {
  const userID = req.user.id
  const user = await User.findById(userID)

  if (!user) {
    res.status(401)
    throw new Error('User Not Found!')
  }

  // check if is admin and not suspended
  if (user.isAdmin === false) {
    res.status(400)
    throw new Error('Adnin area only - you do not have permisión to access this area')
  }

  if (user.isSuspended === true) {
    res.status(401)
    throw new Error('You are currently suspended please contact admin support!')
  }

  // get all users
  const users = await User.find()

  if (!users) {
    res.status(404)
    throw new Error('no users found ')
  }

  res.status(200).json(users)
})

// @desc update  user blog
// @route PUT api/blogs/:id
// @ access private
// ---> NAME NEEDS TO BE CHANGED THROUGHOUT  <---
const updateUserDate = asyncHandler(async (req, res) => {
  const userID = req.user.id
  const user = await User.findById(userID)

  if (!user) {
    res.status(401)
    throw new Error('User Not Found!')
  }

  const loggedinUser = await User.findById(req.params.id)

  if (!user) {
    res.status(404)
    throw new Error('user not found ')
  }

  // limit blog article to that user
  if (loggedinUser._id.toString() !== userID) {
    res.status(401)
    throw new Error('Not Authorized this must be your profile to update ')
  }

  const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  })

  res.status(200).json(updatedUser)
})

// CHECK THE RES.STATUS
const updateUserPfofileImg = asyncHandler(async (req, res) => {
  const userID = req.user._id
  const loggedInUser = await User.findById(userID)

  const result = await cloudinary.uploader.upload(req.file.path, {
    folder: 'userAvatars',
    width: 200,
    height: 200,
  })

  fs.unlink(req.file.path, (err) => {
    if (err) {
      console.error(`Failed to delete local file: ${req.file.path}`)
    } else {
      console.log(`Successfully deleted local file: ${req.file.path}`)
    }
  })

  // if user has not yet uploaded a file
  if (loggedInUser.avatarPublicId) {
    await cloudinary.uploader.destroy(loggedInUser.avatarPublicId)
  }

  loggedInUser.avatar = result.secure_url

  loggedInUser.avatarPublicId = result?.public_id

  await loggedInUser.save()

  res.status(201).json({ msg: 'success', updatedUser: loggedInUser })
})

// prettier-ignore
const generateToken = (id, admin) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {    
    expiresIn: '30d',
  })
}

module.exports = {
  registerUser,
  loginUser,
  getMe,
  getCurrentUSer,
  createUserAdmin,
  getAllUsersAdmin,
  changePassword,
  changeEmail,
  changeName,
  deleteUser,
  updateUserPfofileImg,

  // update user
  updateUserDate,
}
