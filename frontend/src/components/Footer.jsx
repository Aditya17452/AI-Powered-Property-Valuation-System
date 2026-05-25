export function Footer() {
  return (
    <footer style={{ background:'var(--navy-2)', borderTop:'1px solid rgba(255,255,255,0.06)', padding:'60px 0 24px' }}>
      <div className="container">
        <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr', gap: 48, marginBottom: 48 }}>
          <div>
            <div style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:'1.2rem', marginBottom: 8 }}>🏠 IntelliValue</div>
            <div style={{ color:'var(--gray)', fontSize:'0.85rem', marginBottom: 4 }}>Indore Property Intelligence</div>
            <div style={{ color:'var(--gray-2)', fontSize:'0.8rem', lineHeight: 1.65, maxWidth: 280, marginTop: 12 }}>
              AI-powered fair market valuation for Indore's real estate — transparent, explainable, and data-driven.
            </div>
          </div>
          <div>
            <div style={{ fontWeight:600, marginBottom: 16, fontSize:'0.85rem', textTransform:'uppercase', letterSpacing:'0.08em', color:'var(--gray)' }}>Navigate</div>
            {[['/','/Home'],['valuate/','Valuate'],['history/','History'],['about/','About'],['contact/','Contact']].map(([to,l]) => (
              <div key={l} style={{ marginBottom: 8 }}>
                <a href={to} style={{ color:'var(--gray)', textDecoration:'none', fontSize:'0.9rem', transition:'color 0.2s' }} onMouseEnter={e=>e.target.style.color='var(--white)'} onMouseLeave={e=>e.target.style.color='var(--gray)'}>{l}</a>
              </div>
            ))}
          </div>
          <div>
            <div style={{ fontWeight:600, marginBottom: 16, fontSize:'0.85rem', textTransform:'uppercase', letterSpacing:'0.08em', color:'var(--gray)' }}>Contact</div>
            <div style={{ color:'var(--gray)', fontSize:'0.85rem', marginBottom: 8 }}>
              <a href="mailto:sakshamservices2025@gmail.com" style={{ color:'var(--gray)', textDecoration:'none' }}>sakshamservices2025@gmail.com</a>
            </div>
            <div style={{ color:'var(--gray)', fontSize:'0.85rem' }}>
              <a href="tel:+917999105415" style={{ color:'var(--gray)', textDecoration:'none' }}>+91 7999105415</a>
            </div>
            <div style={{ color:'var(--gray-2)', fontSize:'0.8rem', marginTop: 8 }}>Indore, Madhya Pradesh</div>
          </div>
        </div>
        <div style={{ height:1, background:'rgba(255,255,255,0.06)', marginBottom: 24 }} />
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap: 12 }}>
          <div style={{ color:'var(--gray-2)', fontSize:'0.8rem' }}>© 2025 IntelliValue. Built for Indore.</div>
          <div style={{ color:'var(--gray-2)', fontSize:'0.8rem' }}>Developed by Aditya Chouksey, Darpan Nanpuriya, Yash Joshi</div>
        </div>
      </div>
    </footer>
  )
}
