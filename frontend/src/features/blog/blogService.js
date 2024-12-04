import axios from 'axios'
const API_URL = '/api/blogs/'
const DELETE_AS_ADMIN = '/api/blogs/admin-delete/'
const PUBLIC = '/api/public/blogs/'
const ADMIN = '/api/admin/'
const ADMIN_CREATE = '/api/admin/create/user-blog/admin'
const DELETE_IMG = '/api/blogs/delete-img'
const UPDATE_IMG = '/api/blogs/update-img'
const ADD_IMGS_BULK = '/api/blogs/update-imgs/bulk'
const DELETE_IMGS_BULK = '/api/blogs/delete-imgs/bulk'

const createBlog = async (blogData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const response = await axios.post(API_URL, blogData, config)
  return response.data
}

const getUserBlogs = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.get(API_URL, config)

  return response.data
}

const getPublicBlogs = async () => {
  const response = await axios.get(PUBLIC)

  return response.data
}

const getPublicBlog = async (id) => {
  const response = await axios.get(PUBLIC + id)

  return response.data
}
const updatePublicBlog = async (id, data) => {
  const views = data.views

  const response = await axios.put(PUBLIC + id, data)

  return response.data
}

const getUserBlog = async (blogID, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.get(API_URL + blogID, config)

  return response.data
}

const updateUserBlog = async (blogID, token, data) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.put(API_URL + blogID, data, config)

  return response.data
}

const deleteBlogPost = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  //  making the request
  const response = await axios.delete(API_URL + id, config)

  return response.data
}

// ===== ADMIN ==== //

const getAdminBlogs = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.get(ADMIN, config)

  return response.data
}
const getBlogAdmin = async (token, id) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.get(ADMIN + id, config)

  return response.data
}

const updateBlogAdmin = async (blogID, token, data) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.put(ADMIN + blogID, data, config)

  return response.data
}

const deleteBlogPostAdmin = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  //  making the request
  const response = await axios.delete(DELETE_AS_ADMIN + id, config)

  return response.data
}

const createBlogAsAdmin = async (blogData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.post(ADMIN_CREATE, blogData, config)
  return response.data
}

const deleteBlogImg = async (token, data) => {
  console.log('the data', data)
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.put(DELETE_IMG, data, config)
  console.log(response)
  return response.data
}

const updateBlogImg = async (token, data) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.put(UPDATE_IMG, data, config)
  console.log(response)
  return response.data
}

const addBulkImages = async (token, data) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.put(ADD_IMGS_BULK, data, config)
  console.log(response)
  return response.data
}

const deleteAllImages = async (token, data) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.put(DELETE_IMGS_BULK, data, config)
  console.log(response)
  return response.data
}

const blogService = {
  createBlog,
  getUserBlogs,
  getUserBlog,
  updateUserBlog,
  deleteBlogPost,
  getPublicBlogs,
  getPublicBlog,
  updatePublicBlog,
  deleteBlogImg,
  updateBlogImg,
  addBulkImages,
  deleteAllImages,
  // admin
  getAdminBlogs,
  getBlogAdmin,
  updateBlogAdmin,
  deleteBlogPostAdmin,
  createBlogAsAdmin,
}

export default blogService
