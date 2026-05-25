import axios from 'axios'

const BASE_URL = "http://localhost:8000"

export const predictProperty = async (formData) => {
  const response = await axios.post(`${BASE_URL}/api/predict`, formData)
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
