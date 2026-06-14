import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/valuate')
    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        'Something went wrong. Please try again.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <div className="orb orb-1" />
      <div className="orb orb-2" />

      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '96px 20px 40px',
        position: 'relative',
        zIndex: 1,
      }}>
        <div className="auth-card card fi fi-1" style={{ width: '100%', maxWidth: 440, border: '1px solid rgba(220,38,38,0.2)' }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <span className="eyebrow">Welcome back</span>
            <h1 className="section-heading" style={{ fontSize: '2rem' }}>
              Sign in to <em>IntelliValue</em>
            </h1>
            <p className="body-sm" style={{ marginTop: 8 }}>
              Access AI-powered property valuations for Indore
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="warn" style={{ marginBottom: 20 }}>
              <span>⚠</span>
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div className="form-group">
              <label className="form-label" htmlFor="login-email">Email address</label>
              <input
                id="login-email"
                type="email"
                className="form-control"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="login-password">Password</label>
              <input
                id="login-password"
                type="password"
                className="form-control"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            <button
              id="login-submit"
              type="submit"
              className="btn btn-primary btn-full"
              disabled={loading}
              style={{ marginTop: 6 }}
            >
              {loading ? (
                <>
                  <span className="spin" />
                  Signing in…
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Footer link */}
          <p style={{ textAlign: 'center', marginTop: 24, fontSize: '0.875rem', color: 'var(--muted)' }}>
            Don&apos;t have an account?{' '}
            <Link to="/signup" style={{ color: '#ef4444', textDecoration: 'none', fontWeight: 500 }}>
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
