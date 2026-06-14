import { useState } from 'react'
export function Contact() {
  const [form, setForm] = useState({ name:'', email:'', message:'' })
  const [sent, setSent] = useState(false)
  const [toastVisible, setToastVisible] = useState(false)

  const submit = () => {
    if (!form.name || !form.email || !form.message) return
    setSent(true)
    setToastVisible(true)
    setForm({ name:'', email:'', message:'' })
    setTimeout(() => setToastVisible(false), 3500)
  }

  return (
    <div className="page">
      <div className="bg-mesh" />
      <div className="container" style={{ paddingBottom: 100 }}>

        <div style={{ textAlign:'center', maxWidth: 560, margin:'0 auto 64px' }}>
          <div className="label" style={{ marginBottom: 12 }}>Contact Us</div>
          <h1 className="section-title fade-up">
            Get in <span className="text-gradient">Touch</span>
          </h1>
          <p className="fade-up fade-up-1" style={{ color:'var(--gray)', marginTop: 14, lineHeight: 1.7 }}>
            Questions about your valuation? Want to collaborate? We'd love to hear from you.
          </p>
        </div>

        <div className="grid-2" style={{ maxWidth: 900, margin:'0 auto', gap: 32, alignItems:'start' }}>

          {/* Left — Info */}
          <div className="fade-up" style={{ display:'flex', flexDirection:'column', gap: 16 }}>
            {[
              { icon:'📧', label:'Email', val:'sakshamservices2025@gmail.com', href:'mailto:sakshamservices2025@gmail.com' },
              { icon:'📞', label:'Phone', val:'+91 7999105415', href:'tel:+917999105415' },
              { icon:'📍', label:'Location', val:'Indore, Madhya Pradesh, India', href: null },
            ].map(c => (
              <div key={c.label} className="card" style={{ padding: 24, display:'flex', gap: 16, alignItems:'center' }}>
                <div style={{ width:48, height:48, borderRadius:14, background:'rgba(220,38,38,0.12)', border:'1px solid rgba(220,38,38,0.3)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.4rem', flexShrink:0 }}>{c.icon}</div>
                <div>
                  <div style={{ fontSize:'0.75rem', color:'var(--gray)', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom: 4 }}>{c.label}</div>
                  {c.href
                    ? <a href={c.href} style={{ color:'var(--white)', fontWeight:500, textDecoration:'none', transition:'color 0.2s' }} onMouseEnter={e=>e.target.style.color='var(--blue-light)'} onMouseLeave={e=>e.target.style.color='var(--white)'}>{c.val}</a>
                    : <div style={{ color:'var(--white)', fontWeight:500 }}>{c.val}</div>
                  }
                </div>
              </div>
            ))}

            <div className="card" style={{ padding: 24, marginTop: 8 }}>
              <div style={{ fontFamily:'var(--font-display)', fontWeight:700, marginBottom: 10, fontSize:'0.95rem' }}>About IntelliValue</div>
              <p style={{ color:'var(--gray)', fontSize:'0.88rem', lineHeight: 1.7 }}>
                IntelliValue is a final-year B.Tech minor project from Indore, 
                demonstrating AI-powered property valuation using XGBoost, 
                FastAPI, and Groq's LLaMA3.
              </p>
            </div>
          </div>

          {/* Right — Form */}
          <div className="card fade-up fade-up-1" style={{ padding: 32 }}>
            <h2 style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'1.1rem', marginBottom: 24 }}>Send a Message</h2>
            <div style={{ display:'flex', flexDirection:'column', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Your Name</label>
                <input className="form-control" placeholder="Enter your name" value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input className="form-control" type="email" placeholder="your@email.com" value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))} />
              </div>
              <div className="form-group">
                <label className="form-label">Message</label>
                <textarea className="form-control" rows={5} placeholder="Your message..." style={{ resize:'vertical' }} value={form.message} onChange={e=>setForm(p=>({...p,message:e.target.value}))} />
              </div>
              <button className="btn btn-primary btn-full" onClick={submit}>
                Send Message →
              </button>
            </div>
          </div>
        </div>
      </div>

      {toastVisible && (
        <div className="toast">✅ Message sent! We'll get back to you soon.</div>
      )}
    </div>
  )
}

