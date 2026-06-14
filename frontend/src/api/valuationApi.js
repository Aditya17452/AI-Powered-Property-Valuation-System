import axios from 'axios'

const BASE_URL = "http://localhost:8000"

export const predictProperty = async (formData) => {
  const token = localStorage.getItem('iv_token')
  const response = await axios.post(`${BASE_URL}/api/predict`, formData, {
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  })
  return response.data
}

export const getLocalities = async () => {
  const response = await axios.get(`${BASE_URL}/api/localities`)
  return response.data
}

export const checkHealth = async () => {
  const response = await axios.get(`${BASE_URL}/api/health`)
  return response.data
}
