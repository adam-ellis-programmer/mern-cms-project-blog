const {
  signUp,
  getEmailsAdmin,
  footerSignUp,
  msgSignUp,
  getUserForEmailAdmin,
  sendEmail,
  getSentEmails,
  getSingleEmail,
  trackEmail,
} = require('../controllers/emailController')
const express = require('express')
const router = express.Router()

const { protect } = require('../middleware/authMiddleware')

router.route('/').post(signUp).get(protect, getEmailsAdmin)
// get user for email viewing
router.route('/user').post(protect, getUserForEmailAdmin)
// send email as admin from email list page
router.route('/user/send').post(protect, sendEmail)
// get sent emails
router.route('/sent').get(protect, getSentEmails)
// track email for opened
router.route('/track-email').get(trackEmail)
// read single email
router.route('/single/:id').get(protect, getSingleEmail)
// no need for id as we get this from token
router.route('/footer').post(footerSignUp)
// msg (ask page) email sign up page
router.route('/msg').post(msgSignUp)

module.exports = router
