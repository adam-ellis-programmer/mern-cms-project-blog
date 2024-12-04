import axios from 'axios'

const USER = '/api/users/update/'

const SIGNUP = '/api/emails'
const SIGNUP_FOOTER = '/api/emails/footer'
const SIGNUP_MSG_FORM = '/api/emails/msg'
const CURRENT_USER = '/api/users/logged-in-user/'
const GET_ME = '/api/users/me'
const UPDATE_PW = '/api/users/change-pw'
const UPDATE_EMAIL = '/api/users/change-email'
const UPDATE_NAME = '/api/users/change-name'
const DELETE_USER = '/api/users/delete-user/'
const UPDATE_USER_PROFILE_IMG = '/api/users/update-user-img'

const updateUserDate = async (blogID, data, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.put(USER + blogID, data, config)

  return response.data
}

// =====================

const getCurrentUSer = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.get(CURRENT_USER, config)

  return response.data
}
const getMe = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.get(GET_ME, config)

  return response.data
}

const updatePassword = async (data, token) => {
  console.log(data)
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.put(UPDATE_PW, data, config)

  return response.data
}

const updateEmail = async (data, token) => {
  console.log(data)
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.put(UPDATE_EMAIL, data, config)

  return response.data
}

const updateName = async (data, token) => {
  console.log(data)
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.put(UPDATE_NAME, data, config)

  return response.data
}

const deleteUser = async (id, token) => {
  console.log(id)
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.delete(DELETE_USER + id, config)

  return response.data
}

// find the correct url
const emailSignUp = async (data) => {
  if (data.from === 'footer') {
    const response = await axios.post(SIGNUP_FOOTER, data.data)
    return response.data
  } else if (data.from === 'msgPage' || data.from === 'regPage') {
    const response = await axios.post(SIGNUP_MSG_FORM, data.data)
    return response.data
  } else {
    const response = await axios.post(SIGNUP, data.data)
    return response.data
  }
}

const updateUserProfileImage = async (data, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.put(UPDATE_USER_PROFILE_IMG, data, config)

  return response.data
}
const userService = {
  updateUserDate,
  getCurrentUSer,
  emailSignUp,
  getMe,
  updateName,
  updatePassword,
  updateEmail,
  deleteUser,
  updateUserProfileImage,
}

export default userService
