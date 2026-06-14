import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer style={{ background: 'var(--bg2)', borderTop: '1px solid var(--border)', padding: '52px 0 24px' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 48, marginBottom: 40 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
              🏠 IntelliValue
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--muted)', marginBottom: 14 }}>Indore Property Intelligence</div>
            <p style={{ fontSize: '0.82rem', color: 'var(--muted)', lineHeight: 1.7, maxWidth: 260 }}>
              AI-powered fair market valuation for Indore — transparent, explainable, and data-driven.
            </p>
          </div>
          <div>
            <div style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted)', marginBottom: 16 }}>Navigate</div>
            {[['/', 'Home'], ['/valuate', 'Valuate'], ['/history', 'History'], ['/about', 'About'], ['/contact', 'Contact']].map(([to, l]) => (
              <div key={l} style={{ marginBottom: 8 }}>
                <Link to={to} style={{ fontSize: '0.875rem', color: 'var(--muted)', textDecoration: 'none', transition: 'color 0.15s' }}
                  onMouseEnter={e => e.target.style.color = 'var(--white)'}
                  onMouseLeave={e => e.target.style.color = 'var(--muted)'}>{l}</Link>
              </div>
            ))}
          </div>
          <div>
            <div style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted)', marginBottom: 16 }}>Contact</div>
            <a href="mailto:sakshamservices2025@gmail.com" style={{ display: 'block', fontSize: '0.82rem', color: 'var(--muted)', textDecoration: 'none', marginBottom: 8, wordBreak: 'break-all' }}>sakshamservices2025@gmail.com</a>
            <a href="tel:+917999105415" style={{ display: 'block', fontSize: '0.82rem', color: 'var(--muted)', textDecoration: 'none', marginBottom: 8 }}>+91 7999105415</a>
            <div style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>Indore, Madhya Pradesh</div>
          </div>
        </div>
        <div className="hr" style={{ marginBottom: 20 }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>© 2025 IntelliValue. Built for Indore.</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>Aditya Chouksey · Darpan Nanpuriya · Yash Joshi</div>
        </div>
      </div>
    </footer>
  )
}
