const mongoose = require('mongoose')

const blogSchemaAdmin = mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    category: {
      type: String,
      required: [true, 'please select a Category'],
    },
    author: {
      type: String,
      required: [true, 'please select a Author'],
    },
    blogTitle: {
      type: String,
      required: [true, 'please enter a blog title'],
    },
    blogBody: {
      type: String,
      required: [true, 'please enter some blog text'],
    },
    featured: {
      type: Boolean,
      // required: [true, 'please enter some blog text'],
    },
    publish: {
      type: Boolean,
      // required: [true, 'please enter some blog text'],
    },
    suspended: {
      type: Boolean,
      default: false,
      // required: [true, 'please enter some blog text'],
    },
    createdByAdmin: {
      type: Boolean,
      default: false,
    },

    lastEdited: {
      type: String,
      default: 'not edited',
    },

    status: {
      type: String,
      enum: ['original', 'edited'],
      default: 'original',
    },

    views: {
      type: Number,
      default: 0,
    },

    images: {
      type: Array,
    },
    profileImg: {
      type: String,
    },
    // imges: {main: 'head', array:[]}
    heroImg: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Blog', blogSchemaAdmin)
