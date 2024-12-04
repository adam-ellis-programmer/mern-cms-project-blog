const mongoose = require('mongoose')
// Remember: Structure [] is expectiong an array
const blogSchema = mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    country: {
      type: String,
      required: [true, 'please select a country'],
    },
    author: {
      type: String,
      required: [true, 'please select a author'],
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

    //  why imageData is { } and arrays are []
    imageData: {
      heroImage: {
        url: { type: String },
        id: { type: String },
      },
      imageUrls: [
        {
          url: { type: String },
          id: { type: String },
        },
      ],
    },
    profileImg: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Blog', blogSchema)
