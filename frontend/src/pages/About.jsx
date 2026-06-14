export function About() {
  const team = [
    { name:'Aditya Chouksey', role:'Team Leader & ML Engineer', init:'AC', color:'linear-gradient(135deg,#1d4ed8,#3b82f6)' },
    { name:'Darpan Nanpuriya', role:'Backend Developer', init:'DN', color:'linear-gradient(135deg,#d97706,#f59e0b)' },
    { name:'Yash Joshi', role:'Frontend Developer', init:'YJ', color:'linear-gradient(135deg,#059669,#10b981)' },
  ]
  const tech = [
    { name:'XGBoost', desc:'ML model (R²=0.9953)', icon:'🤖' },
    { name:'FastAPI', desc:'Python backend', icon:'⚡' },
    { name:'React + Vite', desc:'Frontend framework', icon:'⚛️' },
    { name:'Groq LLaMA3', desc:'Explanation LLM', icon:'✨' },
    { name:'SHAP', desc:'Explainability layer', icon:'📊' },
    { name:'Tailwind CSS', desc:'UI styling', icon:'🎨' },
  ]
  return (
    <div className="page">
      <div className="bg-mesh" />
      <div className="container" style={{ paddingBottom: 100 }}>

        {/* Hero */}
        <div style={{ textAlign:'center', maxWidth: 680, margin:'0 auto 80px' }}>
          <div className="label" style={{ marginBottom: 12 }}>About the Project</div>
          <h1 className="section-title fade-up">
            Built for <span className="text-gradient">Indore's</span> Real Estate Market
          </h1>
          <p className="fade-up fade-up-1" style={{ color:'var(--gray)', marginTop: 16, lineHeight: 1.75, fontSize:'1.05rem' }}>
            IntelliValue is a student project that demonstrates how AI can bring
            transparency to India's property market — starting with Indore.
            Unlike listing platforms that show aspirational prices, we predict
            the <strong style={{ color:'var(--white)' }}>actual fair market value</strong>.
          </p>
        </div>

        {/* What makes us different */}
        <div style={{ marginBottom: 80 }}>
          <div className="grid-3">
            {[
              { icon:'🎯', title:'Fair Value, Not Listing Price', desc:'Listing prices are what sellers want. Our model predicts what the property should actually trade for based on 19 market factors.' },
              { icon:'🔍', title:'Explainable AI', desc:'We don\'t just give a number. Our Groq LLaMA3 agent explains exactly why your property is valued the way it is.' },
              { icon:'📍', title:'Indore-Specific', desc:'Trained exclusively on Indore properties across 26 localities, accounting for MP IGRS circle rates and local market patterns.' },
            ].map((c, i) => (
              <div key={i} className="card fade-up" style={{ padding: 28, animationDelay:`${i*0.1}s` }}>
                <div style={{ fontSize:'2rem', marginBottom: 16 }}>{c.icon}</div>
                <h3 style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'1rem', marginBottom: 10 }}>{c.title}</h3>
                <p style={{ color:'var(--gray)', fontSize:'0.88rem', lineHeight: 1.65 }}>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="glow-line" />

        {/* Tech stack */}
        <div style={{ margin:'80px 0' }}>
          <div style={{ textAlign:'center', marginBottom: 40 }}>
            <div className="label" style={{ marginBottom: 12 }}>Technology Stack</div>
            <h2 className="section-title">What Powers <span className="text-gradient">IntelliValue</span></h2>
          </div>
          <div className="grid-3">
            {tech.map((t, i) => (
              <div key={i} className="card fade-up" style={{ padding: 24, display:'flex', gap: 16, alignItems:'center', animationDelay:`${i*0.08}s` }}>
                <div style={{ fontSize:'2rem', flexShrink:0 }}>{t.icon}</div>
                <div>
                  <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'0.95rem' }}>{t.name}</div>
                  <div style={{ color:'var(--gray)', fontSize:'0.82rem', marginTop: 2 }}>{t.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glow-line" />

        {/* Team */}
        <div style={{ marginTop: 80 }}>
          <div style={{ textAlign:'center', marginBottom: 48 }}>
            <div className="label" style={{ marginBottom: 12 }}>The Developers</div>
            <h2 className="section-title">Meet the <span className="text-gradient">Team</span></h2>
          </div>
          <div className="grid-3" style={{ maxWidth: 760, margin:'0 auto' }}>
            {team.map((m, i) => (
              <div key={i} className="team-card fade-up" style={{ animationDelay:`${i*0.12}s` }}>
                <div className="avatar" style={{ background: m.color }}>{m.init}</div>
                <h3 style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'1.05rem', marginBottom: 6 }}>{m.name}</h3>
                <div style={{ color:'var(--gray)', fontSize:'0.85rem' }}>{m.role}</div>
                {i === 0 && <div className="badge badge-gold" style={{ marginTop: 12, fontSize:'0.7rem' }}>Team Leader</div>}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

