const mongoose = require('mongoose')

// object of fields
const msgSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'please enter a name'],
  },

  lastName: {
    type: String,
    required: [true, 'please enter a name'],
  },

  fullName: {
    type: String,
    required: [true, 'please enter a name'],
  },

  email: {
    type: String,
    required: [true, 'please enter a name'],
  },

  phone: {
    type: String,
    required: [true, 'please enter a name'],
  },

  msg: {
    type: String,
    required: [true, 'please enter a name'],
  },
  about: {
    type: String,
  },

  contactPhone: {
    type: Boolean,
    default: false,
  },
  contactEmail: {
    type: Boolean,
    default: false,
  },
  mailingList: {
    type: Boolean,
    default: false,
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
})

module.exports = mongoose.model('Messages', msgSchema)
