import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const BASE_URL = 'http://localhost:8000'
const TOKEN_KEY = 'iv_token'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))
  const [loading, setLoading] = useState(true)

  // On mount: if token exists, restore session via /me
  useEffect(() => {
    const stored = localStorage.getItem(TOKEN_KEY)
    if (!stored) {
      setLoading(false)
      return
    }
    axios
      .get(`${BASE_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${stored}` },
      })
      .then((res) => {
        setUser(res.data)
        setToken(stored)
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY)
        setToken(null)
      })
      .finally(() => setLoading(false))
  }, [])

  const _persist = (data) => {
    localStorage.setItem(TOKEN_KEY, data.access_token)
    setToken(data.access_token)
    setUser(data.user)
  }

  const login = async (email, password) => {
    const res = await axios.post(`${BASE_URL}/api/auth/login`, { email, password })
    _persist(res.data)
    return res.data
  }

  const signup = async (name, email, password) => {
    const res = await axios.post(`${BASE_URL}/api/auth/signup`, { name, email, password })
    _persist(res.data)
    return res.data
  }

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY)
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
