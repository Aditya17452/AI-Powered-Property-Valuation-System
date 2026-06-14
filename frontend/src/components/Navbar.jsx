import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [imgError, setImgError] = useState(false)
  const [dropOpen, setDropOpen] = useState(false)

  const links = [
    { to: '/', label: 'Home' },
    { to: '/valuate', label: 'Valuate' },
    { to: '/history', label: 'History' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ]

  const firstName = user?.name?.split(' ')[0] ?? ''

  const handleLogout = () => {
    logout()
    setDropOpen(false)
    navigate('/')
  }

  return (
    <>
      {/* Backdrop to close dropdown on outside click */}
      {dropOpen && (
        <div
          className="nav-backdrop"
          onClick={() => setDropOpen(false)}
        />
      )}

      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        height: 72,
        background: 'rgba(26,10,10,0.92)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(220,60,60,0.15)',
        boxShadow: '0 1px 0 rgba(0,0,0,0.3)',
        display: 'flex', alignItems: 'center',
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>

          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 11 }}>
            {!imgError && (
              <img
                src="/property-logo.png"
                alt="IntelliValue"
                style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 9 }}
                onError={() => setImgError(true)}
              />
            )}
            {imgError && (
              <span style={{ fontSize: '1.6rem' }}>🏠</span>
            )}
            <div>
              <div style={{
                fontFamily: 'var(--sans)', fontWeight: 700, fontSize: '1.15rem',
                color: 'var(--white)', letterSpacing: '-0.02em', lineHeight: 1.1,
              }}>IntelliValue</div>
              <div style={{
                fontSize: '0.6rem', color: 'var(--muted)',
                letterSpacing: '0.12em', textTransform: 'uppercase',
              }}>Indore Property Intelligence</div>
            </div>
          </Link>

          {/* Nav links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {links.map(l => {
              const active = pathname === l.to
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  style={{
                    padding: '10px 18px',
                    borderRadius: 9,
                    fontSize: '0.925rem',
                    fontWeight: active ? 600 : 400,
                    color: active ? 'var(--white)' : 'var(--muted)',
                    textDecoration: 'none',
                    background: active ? 'rgba(220,38,38,0.12)' : 'transparent',
                    transition: 'all 0.15s ease',
                    borderBottom: active ? '1.5px solid #dc2626' : '1.5px solid transparent',
                  }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.color = 'var(--white)' }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.color = 'var(--muted)' }}
                >
                  {l.label}
                </Link>
              )
            })}
          </div>

          {/* Auth section */}
          {user ? (
            <div style={{ position: 'relative', zIndex: 200 }}>
              <button
                id="navbar-user-btn"
                onClick={() => setDropOpen(o => !o)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 9,
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid var(--border)',
                  borderRadius: 10,
                  padding: '9px 16px',
                  color: 'var(--white)',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  fontFamily: 'var(--sans)',
                  transition: 'background 0.15s, border-color 0.15s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.10)'
                  e.currentTarget.style.borderColor = 'var(--border-strong)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
                  e.currentTarget.style.borderColor = 'var(--border)'
                }}
              >
                <span style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: 'var(--blue)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.72rem', fontWeight: 700, color: 'white',
                  flexShrink: 0,
                }}>
                  {firstName.charAt(0).toUpperCase()}
                </span>
                {firstName}
                <span style={{ fontSize: '0.6rem', color: 'var(--muted)', marginLeft: 2 }}>▾</span>
              </button>

              {dropOpen && (
                <div
                  id="navbar-dropdown"
                  style={{
                    position: 'absolute', top: 'calc(100% + 10px)', right: 0,
                    background: 'var(--bg2)',
                    border: '1px solid var(--border)',
                    borderRadius: 12,
                    minWidth: 190,
                    boxShadow: '0 16px 40px rgba(0,0,0,0.45)',
                    padding: 8,
                    zIndex: 201,
                  }}
                >
                  <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)', marginBottom: 6 }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--white)' }}>{user.name}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: 2 }}>{user.email}</div>
                  </div>
                  <button
                    id="navbar-logout-btn"
                    onClick={handleLogout}
                    style={{
                      width: '100%', textAlign: 'left',
                      padding: '9px 12px',
                      background: 'transparent',
                      border: 'none',
                      borderRadius: 8,
                      color: 'var(--red)',
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      fontFamily: 'var(--sans)',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(248,113,113,0.09)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Link
                id="navbar-signin-link"
                to="/login"
                style={{
                  padding: '10px 20px',
                  borderRadius: 9,
                  fontSize: '0.9rem',
                  color: 'var(--muted2)',
                  textDecoration: 'none',
                  border: '1px solid var(--border)',
                  transition: 'all 0.15s',
                  fontWeight: 500,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = 'var(--white)'
                  e.currentTarget.style.borderColor = 'var(--border-strong)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = 'var(--muted2)'
                  e.currentTarget.style.borderColor = 'var(--border)'
                }}
              >
                Sign In
              </Link>
              <Link
                id="navbar-signup-link"
                to="/signup"
                className="btn btn-primary"
                style={{ padding: '10px 20px', fontSize: '0.9rem' }}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </nav>
    </>
  )
}
