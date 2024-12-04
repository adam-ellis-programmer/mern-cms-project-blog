const mongoose = require('mongoose')

// object of fields
const taskModel = mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    taskText: {
      type: String,
      required: [true, 'please enter a task'],
    },
    taskDate: {
      type: String,
    },
    important: {
      type: Boolean,
      default: false,
    },
    edited: {
      type: Boolean,
      default: false,
    },
    completed: {
      // <-- status
      type: Boolean,
      default: false,
    },
    date: {
      type: String,
    },
    time: {
      type: String,
    },
    updatedDate: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Task', taskModel)
