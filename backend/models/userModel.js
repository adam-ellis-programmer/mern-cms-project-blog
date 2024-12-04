const mongoose = require('mongoose')

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please Enter a name'],
    },
    email: {
      type: String,
      required: [true, 'Please Enter a email'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Please Enter a password'],
    },
    test: {
      type: String,
      required: [true, 'Please Enter a password'],
    },

    tier: String,
    avatar: String,
    avatarPublicId: String,

    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    isSuspended: {
      type: Boolean,
      required: true,
      default: false,
    },
    isSuperAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    terms: {
      type: Boolean,
      required: true,
      default: false,
    },
    emailList: {
      type: Boolean,
      default: false,
    },
    lastLoginDate: {
      type: String,
      default: 'not logged in yet',
    },
    lastLoginTime: {
      type: String,
      default: '--:--',
    },
    logins: {
      type: Number,
      default: 0,
    },

    dob: {
      type: String,
      default: '',
    },
    newLogins: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('User', userSchema)
