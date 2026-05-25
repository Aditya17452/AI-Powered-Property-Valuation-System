import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
export function Navbar() {
  const { pathname } = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const links = [
    { to:'/', label:'Home' },
    { to:'/valuate', label:'Valuate' },
    { to:'/about', label:'About' },
    { to:'/contact', label:'Contact' },
  ]

  const linkStyle = (to) => ({
    padding:'10px 14px',
    borderRadius: 10,
    color: pathname === to ? 'var(--white)' : 'var(--gray)',
    background: pathname === to ? 'rgba(59,130,246,0.15)' : 'transparent',
    textDecoration:'none',
    fontSize:'0.88rem',
    fontWeight: pathname === to ? 600 : 500,
    letterSpacing: '-0.01em',
    transition:'all 0.2s',
    borderBottom: pathname === to ? '2px solid var(--blue-light)' : '2px solid transparent'
  })
  return (
    <nav style={{
      position:'fixed', top:0, left:0, right:0, zIndex: 100,
      background:'rgba(5,13,26,0.85)',
      backdropFilter:'blur(20px)',
      borderBottom:'1px solid rgba(255,255,255,0.06)',
      minHeight: 72, display:'flex', alignItems:'center'
    }}>
      <div className="container" style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap: 16, paddingTop: 12, paddingBottom: 12 }}>
        <Link to="/" style={{ textDecoration:'none', display:'flex', flexDirection:'column', minWidth: 0 }}>
          <div style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:'1.08rem', color:'var(--white)', letterSpacing:'-0.02em', lineHeight: 1.05, whiteSpace:'nowrap' }}>
            🏠 IntelliValue
          </div>
          <div style={{ fontSize:'0.62rem', color:'var(--gray)', letterSpacing:'0.06em', textTransform:'uppercase', lineHeight: 1.05, whiteSpace:'nowrap' }}>Indore Property Intelligence</div>
        </Link>
        <div className="nav-links-desktop" style={{ display:'flex', alignItems:'center', gap: 4 }}>
          {links.map(l => (
            <Link key={l.to} to={l.to} style={linkStyle(l.to)}>{l.label}</Link>
          ))}
        </div>
        <div className="nav-actions-desktop" style={{ display:'flex', alignItems:'center', gap: 12 }}>
          <Link to="/valuate" className="btn btn-primary" style={{ padding:'10px 18px', fontSize:'0.86rem' }}>
            Get Valuation
          </Link>
        </div>
        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setMobileOpen(v => !v)}
          className="nav-mobile-toggle"
          style={{
            display:'none',
            width: 44,
            height: 44,
            borderRadius: 12,
            border: '1px solid rgba(255,255,255,0.12)',
            background: 'rgba(255,255,255,0.04)',
            color: 'var(--white)',
            fontSize: '1.1rem',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          {mobileOpen ? '✕' : '☰'}
        </button>
      </div>

      <div className="nav-mobile-panel" style={{
        display: mobileOpen ? 'block' : 'none',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(5,13,26,0.98)',
        backdropFilter: 'blur(20px)'
      }}>
        <div className="container" style={{ paddingTop: 12, paddingBottom: 16, display:'grid', gap: 10 }}>
          {links.map(l => (
            <Link key={l.to} to={l.to} onClick={() => setMobileOpen(false)} style={{
              ...linkStyle(l.to),
              padding:'12px 14px',
              fontSize:'0.95rem',
              background: pathname === l.to ? 'rgba(59,130,246,0.16)' : 'rgba(255,255,255,0.03)'
            }}>{l.label}</Link>
          ))}
          <Link to="/valuate" onClick={() => setMobileOpen(false)} className="btn btn-primary" style={{ padding:'12px 16px', fontSize:'0.92rem', justifyContent:'center' }}>
          Get Valuation
          </Link>
        </div>
      </div>
    </nav>
  )
}
