const asyncHandler = require('express-async-handler')

const User = require('../models/userModel')
const BlogModel = require('../models/blogModel')
const cloudinary = require('cloudinary').v2
const fs = require('fs') // To delete files

// @desc get ALL user blogs
// @route GET api/
// @ access private
const getBlogs = asyncHandler(async (req, res) => {
  const userID = req.user.id
  const user = await User.findById(userID)

  if (!user) {
    res.status(401)
    throw new Error('User Not Found!')
  }

  const blogs = await BlogModel.find({ userID: userID })

  res.status(200).json(blogs)
})

// @desc create new blog
// @route POST api/blogs
// @ access private
const createBlog = asyncHandler(async (req, res) => {
  const imageUrls = []
  let heroImage = {}

  // hero comes in as a seperate file
  // Process the hero image if it exists
  if (req.files['heroImage'] && req.files['heroImage'][0]) {
    const heroImageFile = req.files['heroImage'][0]

    try {
      // Upload hero image to Cloudinary with higher resolution or different settings if needed
      const result = await cloudinary.uploader.upload(heroImageFile.path, {
        folder: 'blogs/heroImages', // Separate folder for hero images if needed
        width: 1600,
        height: 900,
        crop: 'limit',
        quality: 'auto:best',
        fetch_format: 'auto',
      })

      // Assign the secure URL from Cloudinary to the heroImage variable
      heroImage.url = result.secure_url
      heroImage.id = result.public_id

      // After successfully uploading to Cloudinary, delete the local file
      fs.unlink(heroImageFile.path, (err) => {
        if (err) {
          console.error(`Failed to delete local file: ${heroImageFile.path}`)
        } else {
          console.log(`Successfully deleted local file: ${heroImageFile.path}`)
        }
      })
    } catch (error) {
      console.error('Cloudinary upload error (Hero Image):', error)
      res.status(500)
      throw new Error('Hero image upload failed.')
    }
  }

  // Process other images if they exist
  if (req.files['images'] && req.files['images'].length > 0) {
    for (const file of req.files['images']) {
      try {
        // Upload image to Cloudinary
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'blogs', // The folder where the images will be stored in Cloudinary
          width: 800,
          height: 500,
          crop: 'limit',
          quality: 'auto:good',
          fetch_format: 'auto',
          flags: 'progressive',
        })

        // Push the secure URL from Cloudinary to the imageUrls array
        imageUrls.push({ url: result.secure_url, id: result.public_id })

        // After successfully uploading to Cloudinary, delete the local file
        fs.unlink(file.path, (err) => {
          if (err) {
            console.error(`Failed to delete local file: ${file.path}`)
          } else {
            console.log(`Successfully deleted local file: ${file.path}`)
          }
        })
      } catch (error) {
        console.error('Cloudinary upload error (Image):', error)
        res.status(500)
        throw new Error('Image upload failed.')
      }
    }
  }

  // Destructure the necessary fields from req.body
  const { author, blogTitle, blogBody, country, featured, publish, status, lastEdited } =
    req.body

  if (!author || !blogTitle || !blogBody || !country) {
    res.status(400)
    throw new Error('Please include all required fields.')
  }

  const userID = req.user.id
  const user = await User.findById(userID)

  if (!user) {
    res.status(401)
    throw new Error('No user found.')
  }

  // Create the blog with Cloudinary image URLs
  const blog = await BlogModel.create({
    author,
    userID, // From the JWT signed token decoded in auth and assigned to req.user
    blogTitle,
    blogBody,
    country,
    featured,
    publish,
    status,
    lastEdited,
    imageData: {
      heroImage, // The hero image URL onj
      imageUrls: imageUrls, // The array of other image URLs and IDs
    },
  })

  res.status(201).json(blog)
})

// @desc get  user blog
// @route GET api/blogs/:id
// @ access private
const getBlog = asyncHandler(async (req, res) => {
  const userID = req.user.id
  const user = await User.findById(userID)

  if (!user) {
    res.status(401)
    throw new Error('User Not Found!')
  }

  // if id is not correct show a error page
  // can use mongoose.Types.ObjectId.isValid() -- middleware
  if (req.params.id.length < 24) {
    res.status(400)
    throw new Error('no such blog exists')
  }

  const blog = await BlogModel.findById(req.params.id)

  if (!blog) {
    res.status(404).json({ msg: 'not found ...' })
    throw new Error('No Blog Article Found')
  }

  if (!blog) {
    res.status(404)
    throw new Error('No Blog Article Found')
  }

  // limit blog article to that user
  if (blog.userID.toString() !== userID) {
    res.status(401)
    throw new Error('Not Authorized')
  }

  res.status(200).json(blog)
})

// @desc DELETE  user blog
// @route DELETE api/blogs/:id
// @ access private
const deleteBlog = asyncHandler(async (req, res) => {
  const userID = req.user.id
  const user = await User.findById(userID)

  if (!user) {
    res.status(401)
    throw new Error('User Not Found!')
  }

  const blog = await BlogModel.findById(req.params.id)

  if (!blog) {
    res.status(404)
    throw new Error('No Blog Article Found')
  }

  // limit blog article to that user
  if (blog.userID.toString() !== userID) {
    res.status(401)
    throw new Error('Not Authorized')
  }

  await blog.deleteOne()

  res.status(200).json({ success: true })
})

// @desc update  user blog
// @route PUT api/blogs/:id
// @ access private
const updateBlog = asyncHandler(async (req, res) => {
  const userID = req.user.id
  const user = await User.findById(userID)

  if (!user) {
    res.status(401)
    throw new Error('User Not Found!')
  }

  const blog = await BlogModel.findById(req.params.id)

  if (!blog) {
    res.status(404)
    throw new Error('No Blog Article Found')
  }

  // limit blog article to that user
  if (blog.userID.toString() !== userID) {
    res.status(401)
    throw new Error('Not Authorized this must be your blog to update')
  }

  // req.body has all the data to update
  const updatedBlog = await BlogModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  })

  res.status(200).json(updatedBlog)
})

// @desc get ALL user blogs
// @route GET api/public/
// @ access public
const getPublicBlogs = asyncHandler(async (req, res) => {
  const blogs = await BlogModel.find()
  res.status(200).json(blogs)
})

// @desc update  user blog
// @route PUT api/blogs/:id
// @ access private
const updatePublicBlog = asyncHandler(async (req, res) => {
  const blog = await BlogModel.findById(req.params.id)

  if (!blog) {
    res.status(404)
    throw new Error('No Blog Article Found')
  }

  // new: true --> Mongoose returns the document after the update has been applied.
  const updatedBlog = await BlogModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  })

  res.status(200).json(updatedBlog)
})

const getPublicBlog = asyncHandler(async (req, res) => {
  if (req.params.id.length < 24) {
    res.status(400)
    throw new Error('no such blog exists')
  }

  const blog = await BlogModel.findById(req.params.id)
  // will only show Error if the id is exact length
  // can use mongoose.Types.ObjectId.isValid() middleware
  if (!blog) {
    res.status(404)
    throw new Error('No Blog Article Found ...')
  }

  if (blog.suspended === true) {
    res.status(401)
    throw new Error('this blog has been suspended please contact a member of our team')
  }

  if (blog.publish === false) {
    throw new Error(
      'This blog is not ready to be viewed at this time please check back later!'
    )
  }

  res.status(200).json(blog)
})

// ====================================== ADMIN ====================================== //

const createBlogAsAdmin = asyncHandler(async (req, res) => {
  const imageUrls = []
  let heroImage = {}

  // check for hero image object
  if (req.files['heroImage'] && req.files['heroImage'][0]) {
    // get hero file obj
    const heroImageFile = req.files['heroImage'][0]

    try {
      const result = await cloudinary.uploader.upload(heroImageFile.path, {
        folder: 'blogs/heroImages', // Separate folder for hero images if needed
        width: 1600,
        height: 900,
        crop: 'limit',
        quality: 'auto:best',
        fetch_format: 'auto',
      })

      console.log(result)
      heroImage.url = result.secure_url
      heroImage.id = result.public_id

      fs.unlink(heroImageFile.path, (err) => {
        if (err) {
          console.error(`Failed to delete local file: ${heroImageFile.path}`)
        } else {
          console.log(`Successfully deleted local file: ${heroImageFile.path}`)
        }
      })
    } catch (error) {
      console.error('Cloudinary upload error (Hero Image):', error)
      res.status(500)
      throw new Error('Hero image upload failed.')
    }
  }

  // check for images object / obj contains array
  if (req.files['images'] && req.files['images'].length > 0) {
    for (const file of req.files['images']) {
      console.log('Image PATH -> ', file.path)
      try {
        // Upload image to Cloudinary
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'blogs', // The folder where the images will be stored in Cloudinary
          width: 800,
          height: 500,
          crop: 'limit',
          quality: 'auto:good',
          fetch_format: 'auto',
          flags: 'progressive',
        })

        // Push the secure URL from Cloudinary to the imageUrls array
        imageUrls.push({ url: result.secure_url, id: result.public_id })

        // After successfully uploading to Cloudinary, delete the local file
        fs.unlink(file.path, (err) => {
          if (err) {
            console.error(`Failed to delete local file: ${file.path}`)
          } else {
            console.log(`Successfully deleted local file: ${file.path}`)
          }
        })
      } catch (error) {
        console.error('Cloudinary upload error (Image):', error)
        res.status(500)
        throw new Error('Image upload failed.')
      }
    }
  }

  const {
    author,
    blogTitle,
    blogBody,
    edited,
    country,
    publish,
    featured,
    status,
    lastEdited,
    userID,
    createdByAdmin,
  } = req.body

  if (!author || !blogTitle || !blogBody || !country) {
    res.status(400)
    throw new Error('Please include all fields')
  }

  const loggedInUser = req.user.id
  const user = await User.findById(loggedInUser)

  if (!user) {
    res.status(401)
    throw new Error('User Not Found!')
  }

  if (user.isAdmin === false) {
    res.status(401)
    throw new Error('you have to have admin access to access this area')
  }
  if (user.isSuspended === true) {
    res.status(401)
    throw new Error('you are currently suspended please contact admin support!')
  }

  // if passes above test then create the blog
  const blog = await BlogModel.create({
    author,
    userID,
    blogTitle,
    blogBody,
    country,
    featured,
    publish,
    status,
    lastEdited,
    createdByAdmin,
    imageData: {
      heroImage, // The hero image URL
      imageUrls: imageUrls, // array of other images
    },
  })

  res.status(201).json(blog)
})
const getAllBlogsAdmin = asyncHandler(async (req, res) => {
  const userID = req.user.id
  const user = await User.findById(userID)

  if (!user) {
    res.status(401)
    throw new Error('User Not Found!')
  }

  if (user.isAdmin === false) {
    res.status(401)
    throw new Error('you have to have admin access to access this area')
  }

  if (user.isSuspended === true) {
    res.status(401)
    throw new Error('you art currently suspended please contact admin support!')
  }

  const blogs = await BlogModel.find()
  res.status(200).json(blogs)
})

// @desc get  user blog
// @route GET api/blogs/:id
// @ access private
const getBlogAdmin = asyncHandler(async (req, res) => {
  if (req.params.id.length < 24) {
    res.status(400)
    throw new Error('no such blog exists')
  }

  const userID = req.user.id
  const user = await User.findById(userID)

  if (!user) {
    res.status(401)
    throw new Error('User Not Found!')
  }

  const blog = await BlogModel.findById(req.params.id)

  if (!blog) {
    res.status(404)
    throw new Error('No Blog Article Found')
  }

  // check if is admin
  if (user.isAdmin === false) {
    throw new Error('You must be admin to view this document')
  }

  res.status(200).json(blog)
})

// @desc update blog admin
// @route PUT api/admin/:id
// @ access private
const updateBlogAdmin = asyncHandler(async (req, res) => {
  const userID = req.user.id
  const user = await User.findById(userID)

  if (!user) {
    res.status(401)
    throw new Error('User Not Found!')
  }

  const blog = await BlogModel.findById(req.params.id)

  if (!blog) {
    res.status(404)
    throw new Error('No Blog Article Found')
  }

  if (user.isAdmin === false) {
    throw new Error('you must be admin to edit this blog')
  }

  const updatedBlog = await BlogModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  })

  res.status(200).json(updatedBlog)
})

// @desc DELETE  user blog
// @route DELETE api/blogs/:id
// @ access private
const deleteBlogAdmin = asyncHandler(async (req, res) => {
  const userID = req.user.id
  const user = await User.findById(userID)

  if (!user) {
    res.status(404)
    throw new Error('User Not Found!')
  }

  // check if is admin
  if (user.isAdmin === false) {
    throw new Error('you must be admin to delete this article')
  }

  // if user is suspended
  if (user.isSuspended) {
    throw new Error('you are suspended')
  }

  const blog = await BlogModel.findById(req.params.id)
  console.log(blog)

  if (!blog) {
    res.status(404)
    throw new Error('No Blog Article Found')
  }

  await blog.deleteOne()

  res.status(200).json({ success: true })
})

// delete one blog image
const deleteBlogImage = asyncHandler(async (req, res) => {
  const userID = req.user.id
  const user = await User.findById(userID)
  const blog = await BlogModel.findById(req.body.blogID)

  // flag for delete hero
  const isDeleteHero = req.body.deleteHero

  // check user
  if (!user) {
    res.status(404)
    throw new Error('User Not Found!')
  }

  // check blog owner is true
  if (blog.userID.toString() !== userID) {
    res.status(401)
    throw new Error('Not Authorized')
  }

  const imageData = blog.imageData

  const { imageUrls } = imageData
  const updatedURLS = imageUrls.filter((i) => i.id !== req.body.imgID)

  // check if there to stop error occurring
  if (blog.imageData.imageUrls) blog.imageData.imageUrls = updatedURLS

  // set to heroImage to object and reset
  if (isDeleteHero) blog.imageData.heroImage = {}

  // Make the changes and Save the updated document
  await blog.save()
  await cloudinary.uploader
    .destroy(req.body.imgID)
    .then((data) => console.log('image deleted!'))
  res.status(200).json(blog)
})

// update the blog image
const updateBlogImage = asyncHandler(async (req, res) => {
  const userID = req.user.id
  const user = await User.findById(userID)
  const blog = await BlogModel.findById(req.body.blogID)

  const isHero = req.body.hero

  // check user
  if (!user) {
    res.status(404)
    throw new Error('User Not Found!')
  }

  // check blog
  if (blog.userID.toString() !== userID) {
    res.status(401)
    throw new Error('Not Authorized')
  }

  const imageData = blog.imageData
  const { imageUrls } = imageData

  const result = await cloudinary.uploader.upload(req.file.path, {
    folder: isHero ? 'blogs/heroImages' : 'blogs',
    width: 800,
    height: 500,
    crop: 'limit',
    quality: 'auto:good',
    fetch_format: 'auto',
    flags: 'progressive',
  })

  const newImgData = {
    url: result.secure_url,
    id: result.public_id,
  }

  // only run if not a hero loop to update if match
  if (!isHero) {
    const newArr = imageUrls.map((item) => {
      if (item.id === req.body.imgID) {
        return { ...newImgData }
      } else {
        return { ...item }
      }
    })

    blog.imageData.imageUrls = newArr
  }

  blog.imageData.heroImage = newImgData

  fs.unlink(req.file.path, (err) => {
    if (err) {
      console.error(`Failed to delete local file: ${req.file.path}`)
    } else {
      console.log(`Successfully deleted local file: ${req.file.path}`)
    }
  })

  await blog.save()
  await cloudinary.uploader.destroy(req.body.imgID)

  res.status(200).json({ success: true, blog })
})

// upload bulk images
const uploadBulkImages = asyncHandler(async (req, res) => {
  const userID = req.user.id
  const user = await User.findById(userID)
  const blog = await BlogModel.findById(req.body.blogID)

  // Check user
  if (!user) {
    res.status(404)
    throw new Error('User Not Found!')
  }

  // Check blog ownership
  if (blog.userID.toString() !== userID) {
    res.status(401)
    throw new Error('Not Authorized')
  }

  const imageData = blog.imageData
  const { imageUrls } = imageData || { imageUrls: [] } // Ensure imageUrls is an array

  // Check if files are uploaded
  if (!req.files || req.files.length === 0) {
    res.status(400)
    throw new Error('No files uploaded')
  }

  const imageUrlData = []
  // RESIZE ON UPLOAD
  for (const file of req.files) {
    try {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'blogs',
        width: 800,
        height: 500,
        crop: 'limit',
        quality: 'auto:good',
        fetch_format: 'auto',
        flags: 'progressive',
      })

      imageUrlData.push({ url: result.secure_url, id: result.public_id })

      // Delete the temporary file
      fs.unlink(file.path, (err) => {
        if (err) {
          console.error(`Failed to delete local file: ${file.path}`)
        } else {
          console.log(`Successfully deleted local file: ${file.path}`)
        }
      })
    } catch (error) {
      console.error(`Failed to upload image: ${file.path}`, error)
      throw new Error('Image upload failed')
    }
  }

  // Merge existing images with new images
  const updatedUrlData = [...imageUrls, ...imageUrlData]

  // Update the blog document
  blog.imageData.imageUrls = updatedUrlData

  // Save the updated blog
  await blog.save()

  console.log('Updated Image URLs:', blog.imageData.imageUrls)

  // Send the updated blog in the response for frontend use
  res.status(200).json({ success: true, blog })
})

// delete blog images bulk for blog delete
const deleteBulkImages = asyncHandler(async (req, res) => {
  const userID = req.user.id
  const user = await User.findById(userID)
  const isDeleteBlog = req.body.deleteBlog
  const blog = await BlogModel.findById(req.body.blogID)

  // Check user
  if (!user) {
    res.status(404)
    throw new Error('User Not Found!')
  }

  // Check blog ownership
  // If admin ovride this check (nested if statement )
  if (!user.isAdmin) {
    if (blog.userID.toString() !== userID) {
      res.status(401)
      throw new Error('Not Authorized')
    }
  }

  //  changed the data structure
  const imageData = blog.imageData
  const { imageUrls, heroImage } = imageData || { imageUrls: [] } // Ensure imageUrls is an array

  const newImagesArray = [...imageUrls, heroImage]

  for (const image of newImagesArray) {
    await cloudinary.uploader
      .destroy(image.id)
      .then((data) => console.log('img deleted -- '))
  }

  // delete all images from array
  blog.imageData.imageUrls = []

  // do not save if deleteing blog
  if (!isDeleteBlog) {
    await blog.save()
  }

  res.status(200).json({ success: true, blog })
})

module.exports = {
  getBlogs,
  createBlog,
  getBlog,
  deleteBlog,
  updateBlog,
  getPublicBlogs,
  getPublicBlog,
  updatePublicBlog,
  deleteBlogImage,
  updateBlogImage,
  uploadBulkImages,
  deleteBulkImages,
  // admin
  getAllBlogsAdmin,
  updateBlogAdmin,
  getBlogAdmin,
  deleteBlogAdmin,
  createBlogAsAdmin,
}
