const mongoose = require('mongoose')

// object of fields
const emailsSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'please enter a name'],
  },

  email: {
    type: String,
  },

  terms: {
    type: Boolean,
    default: false,
  },

  date: {
    type: String,
    default: '--:--',
  },

  time: {
    type: String,
    default: '--:--',
  },
  trackingPixelUrl: {
    type: String,
    default: '--:--',
  },
})

module.exports = mongoose.model('Emails', emailsSchema)
