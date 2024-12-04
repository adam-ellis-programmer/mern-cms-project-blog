// called in server js
const errorHandler = (error, req, res, next) => {
  //  500 is server error
  const statusCode = res.statusCode < 400 ? 500 : res.statusCode
  res.status(statusCode)

  res.json({
    message: error.message,
    //  send stack trace
    stack: process.env.NODE_ENV === 'production' ? null : error.stack,
  })
}
module.exports = { errorHandler }


