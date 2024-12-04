// helper functions...
const fs = require('fs')
const handlebars = require('handlebars')
const nodemailer = require('nodemailer')

// Function to load and compile email template
const loadTemplate = (templateName, replacements) => {
  const filePath = `${__dirname}/../email templates/${templateName}.handlebars`
  console.log('FILE-PATH:---->', filePath)

  const html = fs.readFileSync(filePath, 'utf8')
  const template = handlebars.compile(html) // Compile the template
  return template(replacements) // Insert dynamic data into the template
}

// Function to send email
const sendEmailFunc = async (to, subject, htmlContent) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail', // Or another email provider
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // See note below on using app-specific passwords
    },
  })

  const mailOptions = {
    from: 'your_email@gmail.com',
    to: to,
    subject: subject,
    html: htmlContent, // Pass in the HTML content generated from the template
  }

  await transporter.sendMail(mailOptions)
}

// Export the sendEmailFunc function
module.exports = { loadTemplate, sendEmailFunc }
