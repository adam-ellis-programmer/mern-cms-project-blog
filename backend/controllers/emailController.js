const asyncHandler = require('express-async-handler')
const nodemailer = require('nodemailer')
const EmailModel = require('../models/emailModel')
const UserModel = require('../models/userModel')
const MsgModel = require('../models/msgModel')
const SendEmailModel = require('../models/sendEmailModel')
const { v4: uuidv4 } = require('uuid')
const { loadTemplate, sendEmailFunc } = require('../utils/emailSender')

// from the home page
const signUp = asyncHandler(async (req, res) => {
  const { name, email, terms, date, time } = req.body

  if (!name || !email) {
    res.status(400)
    throw new Error('Please include all fields ')
  }

  if (!email.includes('@')) {
    res.status(400)
    throw new Error('must be an email address ')
  }

  if (!terms) {
    res.status(400)
    throw new Error('terms must be accepted')
  }

  // check if email exists
  const emailSignUp = await EmailModel.findOne({ email })
  console.log('FOUND=>', emailSignUp)

  if (emailSignUp) {
    res.status(400)
    throw new Error('Email Already Registered!')
  }

  const newSignUp = await EmailModel.create({
    name,
    email,
    date,
    time,
    terms,
  })

  res.status(201).json(newSignUp)
})

// for message signup (ASK PAGE )
const msgSignUp = asyncHandler(async (req, res) => {
  const { name, email, terms, date, time } = req.body

  const emailSignUp = await EmailModel.findOne({ email })

  if (emailSignUp) {
    res.status(200).json({ msg: 'you are already on our mailing list!' })
    return
  }
  if (!email.includes('@')) {
    res.status(400)
    throw new Error('email must be a email address')
  }

  const newSignUp = await EmailModel.create({
    name,
    email,
    date,
    time,
    terms,
  })

  res.status(201).json(newSignUp)
})

// seperate from the home page
const footerSignUp = asyncHandler(async (req, res) => {
  const { terms, footerEmail, date, time } = req.body

  if (!footerEmail) {
    res.status(400)
    throw new Error('Please provide an email')
  }
  if (!footerEmail.includes('@')) {
    res.status(400)
    throw new Error('please us a proper email address!')
  }

  if (!terms) {
    res.status(400)
    throw new Error('Please accept the terms ')
  }

  const emailSignUp = await EmailModel.findOne({ email: footerEmail })

  if (emailSignUp) {
    res.status(400)
    throw new Error('Email Already Registered!')
  }

  const newSignUp = await EmailModel.create({
    email: footerEmail,
    name: 'footer signup',
    date,
    time,
    terms,
  })

  res.status(201).json(newSignUp)
})

const getEmailsAdmin = asyncHandler(async (req, res) => {
  const userID = req.user._id
  const loggedInAdmin = await UserModel.findById(userID)

  if (loggedInAdmin.isAdmin === false) {
    res.status(401)
    throw new Error('You must be an admin to access these emails')
  }
  if (loggedInAdmin.isSuspended === true) {
    res.status(401)
    throw new Error('You are suspended and cannot access this email area')
  }

  if (!loggedInAdmin) {
    res.status(401)
    throw new Error('User as admin not found')
  }

  // find all
  const allEmails = await EmailModel.find()

  if (!allEmails) {
    throw new Error('somthing went wrong')
  }

  res.status(200).json(allEmails)
})

// to view emails
const getUserForEmailAdmin = asyncHandler(async (req, res) => {
  const userID = req.user._id
  const loggedInAdmin = await UserModel.findById(userID)

  const emailListID = req.body.id

  const userToEmail = await EmailModel.findById(emailListID)

  if (loggedInAdmin.isAdmin === false) {
    res.status(401)
    throw new Error('You must be an admin to access these emails')
  }

  if (!loggedInAdmin) {
    res.status(401)
    throw new Error('You must be logged in as admin to use this feature ')
  }

  if (!userToEmail) {
    res.status(404)
    throw new Error('User not found')
  }

  res.status(200).json(userToEmail)
})

const sendEmail = asyncHandler(async (req, res) => {
  // Generate a unique tracking ID
  const trackingId = uuidv4()
  console.log(req.body)
  const { from, to, text, subject } = req.body

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // See note below on using app-specific passwords
    },
  })

  // Create the tracking pixel URL  ---- NEEDS CHANGEING AS WE HAVE NEW HOSTING
  const trackingPixelUrl = `https://blog-site-jz0i.onrender.com/api/emails/track-email?trackingId=${trackingId}`

  // format and structure emails
  const formattedBody = text.replace(/\n/g, '<br>')
  const replacements = {
    username: to,
    dashboardLink: 'https://example.com/dashboard',
    senderName: from,
    companyName: 'Travel Blogging site',
    body: formattedBody, // Use the formatted body with <br> tags
    subject,
    year: new Date().getFullYear(),
    trackingPixelUrl, // Include the tracking pixel URL
  }
  const welcomeEmail = loadTemplate('genericEmail', replacements)

  try {
    const info = await transporter.sendMail({
      from,
      to,
      subject: `${subject} ✔`,
      text: text, // text is a fallback
      html: welcomeEmail,
    })

    const emailData = {
      to,
      from,
      subject,
      body: formattedBody,
      read: false,
      trackingId,
    }

    // for upadte save() or findByIdAndUpdate()
    const savedEmail = await SendEmailModel.create(emailData)
    console.log(savedEmail)

    // %s --> placeholder <-- info.messageId
    // console.log('Message sent: %s', info.messageId)
    res.status(200).json({ message: 'Email sent successfully' })
  } catch (error) {
    console.error('Error sending email:', error)
    res.status(500).json({ message: 'Error sending email', error })
  }
})

const sendWelcomeEmails = asyncHandler(async (req, res) => {
  const { email, username, invoiceNumber, loginDetails, purchases, tier } = req.body

  console.log(tier)

  // Calculate subtotal, tax, and total
  const subtotal = purchases.reduce((sum, item) => sum + item.total, 0)
  const tax = subtotal * 0.1 // 10% tax rate
  const total = subtotal + tax

  // Prepare the dynamic replacements for Handlebars templates
  const replacements = {
    username,
    invoiceNumber,
    purchases,
    loginDetails,
    subtotal: subtotal.toFixed(2), // Format to 2 decimal places
    tax: tax.toFixed(2),
    total: total.toFixed(2),
  }

  try {
    // Load and compile each email template
    const welcomeEmail = loadTemplate('welcome', replacements)
    const invoiceEmail = loadTemplate('invoice', replacements)
    const loginDetailsEmail = loadTemplate('loginDetails', replacements)

    // Send welcome email
    await sendEmailFunc(email, 'Welcome to Our Service', welcomeEmail)

    // Send invoice email onl if paid tier
    if (tier === 'prem') await sendEmailFunc(email, 'Your Invoice', invoiceEmail)

    // Send login details email
    await sendEmailFunc(email, 'Your Login Details', loginDetailsEmail)

    res.status(200).json({ message: 'Emails sent successfully!' })
  } catch (error) {
    console.error('Error sending emails:', error)
    res.status(500).json({ message: 'Failed to send emails', error })
  }
})

// get all sent emails
const getSentEmails = asyncHandler(async (req, res) => {
  const userID = req.user._id
  const loggedInAdmin = await UserModel.findById(userID)

  if (loggedInAdmin.isAdmin === false) {
    res.status(401)
    throw new Error('You must be an admin to access these emails')
  }
  if (loggedInAdmin.isSuspended === true) {
    res.status(401)
    throw new Error('You are suspended and cannot access this email area')
  }

  if (!loggedInAdmin) {
    res.status(401)
    throw new Error('User as admin not found')
  }

  // find all
  const allEmails = await SendEmailModel.find()

  if (!allEmails) {
    throw new Error('somthing went wrong')
  }

  res.status(200).json(allEmails)

  console.log('how it started...')
})

const trackEmail = asyncHandler(async (req, res) => {
  const { trackingId } = req.query

  if (trackingId) {
    console.log('Tracking pixel endpoint hit.')
    console.log('Tracking ID received:', trackingId)

    // ******** leave for notes ********
    // example with dot notation
    // await SendEmailModel.updateOne(
    //   { trackingId },
    //   {
    //     $set: {
    //       'address.number': 3,
    //       'address.street': 'easy street',
    //       read: true,
    //       openedAt: new Date(),
    //     },
    //   }
    // )

    // Update the database to mark the email as opened
    await SendEmailModel.updateOne(
      { trackingId },
      {
        $set: {
          read: true,
          openedAt: new Date(),
        },
      }
      // { upsert: true }
    )
  } else {
    console.error('No tracking ID provided')
  }

  // Return a 1x1 transparent pixel
  // needed to satisfy the request
  const img = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQI12NgAAAAAgAB4iG8MwAAAABJRU5ErkJggg==',
    'base64'
  )
  res.writeHead(200, { 'Content-Type': 'image/png' })
  res.end(img, 'binary')
})

const getSingleEmail = asyncHandler(async (req, res) => {
  const userID = req.user._id
  const loggedInAdmin = await UserModel.findById(userID)

  if (loggedInAdmin.isAdmin === false) {
    res.status(401)
    throw new Error('You must be an admin to access these emails')
  }
  if (loggedInAdmin.isSuspended === true) {
    res.status(401)
    throw new Error('You are suspended and cannot access this email area')
  }

  if (!loggedInAdmin) {
    res.status(401)
    throw new Error('User as admin not found')
  }

  // Find the email by ID
  const email = await SendEmailModel.findById(req.params.id)

  if (!email) {
    throw new Error('Something went wrong')
  }

  // Sanitize the email body using escapeHtml
  const escapeHtml = (unsafe) => {
    return (
      unsafe
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')
        // Convert back <br> and <p> tags from escaped form
        .replace(/&lt;br&gt;/g, '<br>')
        .replace(/&lt;p&gt;/g, '<p>')
        .replace(/&lt;\/p&gt;/g, '</p>')
    )
  }

  const sanitizedEmailBody = escapeHtml(email.body)

  // Respond with sanitized email data
  res.status(200).json({
    ...email.toObject(), // Convert the Mongoose document to a plain object
    body: sanitizedEmailBody, // Replace the original body with the sanitized one
  })
})

module.exports = {
  signUp,
  getEmailsAdmin,
  footerSignUp,
  msgSignUp,
  getUserForEmailAdmin,
  sendEmail,
  sendWelcomeEmails,
  trackEmail,
  getSentEmails,
  getSingleEmail,
}
