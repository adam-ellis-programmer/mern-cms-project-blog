const mongoose = require('mongoose')

// object of fields
// MAKE A RELATIONSHIP WITH USER AND POPULATE FIELDS
const sendEmailSchema = mongoose.Schema(
  {
    to: {
      type: String,
      default: '',
    },

    from: {
      type: String,
      default: '',
    },

    subject: {
      type: String,
      default: '',
    },

    body: {
      type: String,
      default: '',
    },

    read: {
      type: Boolean,
      default: false,
    },
    openedAt: {
      type: String,
      default: '-- / -- / --',
    },
    trackingId: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('SentEmail', sendEmailSchema)
