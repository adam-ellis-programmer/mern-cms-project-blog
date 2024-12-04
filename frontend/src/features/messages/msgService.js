import axios from 'axios'
const API_URL = '/api/msg/'

const createMsg = async (msgData) => {
  const response = await axios.post(API_URL, msgData)

  return response.data
}

const getAllMsgsAdmin = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const response = await axios.get(API_URL, config)
  return response.data
}

const deleteMsgAdmin = async (token, id) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const response = await axios.delete(API_URL + id, config)
  return response.data
}

const msgService = { createMsg, getAllMsgsAdmin, deleteMsgAdmin }

export default msgService
