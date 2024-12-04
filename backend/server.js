const dotenv = require('dotenv').config()
const colors = require('colors')
const express = require('express')
const PORT = process.env.PORT || 6001
const connectDB = require('./config/db')
const { errorHandler } = require('./middleware/errorMiddleWare')
const path = require('path')
const cloudinary = require('cloudinary').v2
// const cors = require('cors')
// Serve static files from the 'public' folder
const app = express()

// Return "https" URLs by setting secure: true
cloudinary.config({
  cloud_name: 'travel-adam',
  api_key: '976162447695986',
  api_secret: 'ew-2X-SkHrAAhvHWzHcxqV6M69A',
})

connectDB()

//  initialises the app variable
app.use(express.static(path.join(__dirname, '..', 'public', 'uploads')))

// middleware
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// routes in use
app.use('/api/users', require('./routes/userRoutes'))
app.use('/api/blogs', require('./routes/blogRoutes'))
app.use('/api/tasks', require('./routes/taskRoutes'))

app.use('/api/public', require('./routes/publicRoutes'))
app.use('/api/admin', require('./routes/adminRoutes'))

app.use('/api/emails', require('./routes/emailRoutes'))
app.use('/api/msg', require('./routes/msgRoutes'))

// error middleware
app.use(errorHandler)

if (process.env.NODE_ENV === 'production') {
  // set static frontend folder
  app.use(express.static(path.join(__dirname, '../frontend/build')))

  // any route that is not an api will be re-directed to the index.html
  // in the frontend static folder

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, '../frontend', 'build', 'index.html'))
  )
} else {
  // // rest
  app.get('/', (req, res) => {
    res.json({ msg: 'API IS RUNNING ...this is the dev server' })
  })
}

app.listen(PORT, () => console.log('server started on port ', PORT))
