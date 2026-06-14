import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

function useCountUp(target, started, duration = 1600) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!started) return
    let t0 = null
    const raf = (ts) => {
      if (!t0) t0 = ts
      const p = Math.min((ts - t0) / duration, 1)
      const e = 1 - Math.pow(1 - p, 3)
      setVal(Math.floor(e * target))
      if (p < 1) requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)
  }, [started, target, duration])
  return val
}

function Stat({ value, suffix, label, delay, started }) {
  const n = useCountUp(value, started)
  return (
    <div className="stat-card fi" style={{ animationDelay: `${delay}s` }}>
      <span className="stat-number">{n}{suffix}</span>
      <span className="stat-label">{label}</span>
    </div>
  )
}

export default function Home() {
  const statsRef = useRef(null)
  const [go, setGo] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setGo(true) }, { threshold: 0.3 })
    if (statsRef.current) obs.observe(statsRef.current)
    return () => obs.disconnect()
  }, [])

  return (
    <div className="page">
      {/* orbs */}
      <div className="orb orb-1" /><div className="orb orb-2" />

      {/* ── HERO ── */}
      <section style={{ minHeight: 'calc(100vh - 96px)', display: 'flex', alignItems: 'center', padding: '80px 0 60px' }}>
        <div className="container">
          <div className="hero-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: 64, alignItems: 'center' }}>

            <div>
              <span className="eyebrow fi">AI-Powered Property Valuation · Indore</span>
              <h1 className="hero-title fi fi-1" style={{ marginBottom: 24 }}>
                Know the<br />
                <em>True Value</em><br />
                of Your Property
              </h1>
              <p className="body-lg fi fi-2" style={{ maxWidth: 460, marginBottom: 36 }}>
                Stop guessing. Our 3-agent AI pipeline analyses 19+ market factors
                to give you Indore's most transparent property valuation — backed
                by data, not broker estimates.
              </p>
              <div className="fi fi-3" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 40 }}>
                <Link to="/valuate" className="btn btn-primary" style={{ padding: '13px 28px' }}>
                  Get Free Valuation →
                </Link>
                <Link to="/history" className="btn btn-ghost" style={{ padding: '13px 28px' }}>
                  How it Works
                </Link>
              </div>
              <div className="fi fi-4" style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                {['900+ properties analysed', '26 localities covered', '2.3% avg error'].map(t => (
                  <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: '0.82rem', color: 'var(--muted)' }}>
                    <span style={{ color: 'var(--green)', fontSize: '0.9rem' }}>✓</span> {t}
                  </div>
                ))}
              </div>
            </div>

            {/* Mock result card */}
            <div className="float" style={{ position: 'relative' }}>
              {/* glow behind */}
              <div style={{ position: 'absolute', inset: -40, background: 'radial-gradient(circle, rgba(220,38,38,0.15) 0%, transparent 65%)', borderRadius: '50%', pointerEvents: 'none' }} />
              <div style={{
                background: 'rgba(36,15,15,0.95)',
                border: '1px solid rgba(220,60,60,0.2)',
                borderRadius: 18,
                padding: 28,
                position: 'relative', zIndex: 1,
                boxShadow: '0 32px 64px rgba(0,0,0,0.4)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Vijay Nagar — 3BHK</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: 3 }}>1,200 sqft · Apartment</div>
                  </div>
                  <span className="badge badge-green">Fair Value</span>
                </div>

                <div style={{ fontFamily: 'var(--serif)', fontSize: '2.8rem', lineHeight: 1, marginBottom: 6 }}>₹47,20,000</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: 22 }}>₹3,933 / sqft</div>

                <div style={{ height: 1, background: 'var(--border)', marginBottom: 18 }} />

                {[
                  { label: 'Location premium', val: '+18%', c: 'var(--green)' },
                  { label: 'Age discount', val: '-7%', c: 'var(--red)' },
                  { label: 'Amenity score', val: '+5%', c: 'var(--green)' },
                ].map(f => (
                  <div key={f.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--muted)' }}>{f.label}</span>
                    <span style={{ color: f.c, fontWeight: 600 }}>{f.val}</span>
                  </div>
                ))}

                <div style={{ marginTop: 20, display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                  {['🛡', '🧮', '✨'].map((e, i) => (
                    <div key={i} style={{
                      width: 26, height: 26, borderRadius: '50%',
                      background: 'rgba(34,197,94,0.12)',
                      border: '1px solid rgba(34,197,94,0.3)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.7rem',
                    }}>{e}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="hr" />

      {/* ── STATS ── */}
      <section className="section-sm" ref={statsRef}>
        <div className="container">
          <div className="g4">
            <Stat value={900} suffix="+" label="Properties Analysed" delay={0} started={go} />
            <Stat value={26} suffix="" label="Indore Localities" delay={0.07} started={go} />
            <Stat value={99} suffix="%" label="Model Accuracy (R²)" delay={0.14} started={go} />
            <Stat value={3} suffix="" label="AI Agents" delay={0.21} started={go} />
          </div>
        </div>
      </section>

      <div className="hr" />

      {/* ── HOW IT WORKS ── */}
      <section className="section">
        <div className="container">
          <div style={{ marginBottom: 52 }}>
            <span className="eyebrow">The Pipeline</span>
            <h2 className="section-heading">How <em>IntelliValue</em> works</h2>
          </div>

          <div className="g3">
            {[
              { icon: '🛡', num: '01', color: 'rgba(37,99,235,0.12)', title: 'Validation Agent', desc: 'Rule-based agent checks your inputs for anomalies before any prediction — catches impossible combos like 3BHK in 400 sqft or prices 5× above market.' },
              { icon: '🧮', num: '02', color: 'rgba(232,197,71,0.1)', title: 'Valuation Agent', desc: 'XGBoost model trained on 900+ Indore properties. Analyses 19 features: locality, area, age, circle rates, distance from city centre, amenities, and more.' },
              { icon: '✨', num: '03', color: 'rgba(34,197,94,0.1)', title: 'Explanation Agent', desc: 'Groq\'s LLaMA3 reads the prediction and writes a plain-language explanation — specific to your locality, not a generic template.' },
            ].map((s, i) => (
              <div key={i} className="step-card fi" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="step-num">{s.num}</div>
                <div className="step-icon" style={{ background: s.color }}>{s.icon}</div>
                <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: 10 }}>{s.title}</div>
                <p className="body-sm">{s.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 48, textAlign: 'center' }}>
            <Link to="/valuate" className="btn btn-primary" style={{ padding: '13px 32px' }}>
              Try it now →
            </Link>
          </div>
        </div>
      </section>

      <div className="hr" />

      {/* ── CTA ── */}
      <section className="section-sm">
        <div className="container">
          <div style={{
            background: 'rgba(36,15,15,0.8)',
            border: '1px solid rgba(220,38,38,0.25)',
            borderRadius: 18, padding: '52px 40px', textAlign: 'center',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: '-80px', left: '50%', transform: 'translateX(-50%)', width: 400, height: 400, background: 'radial-gradient(circle, rgba(220,38,38,0.10) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <span className="eyebrow" style={{ position: 'relative' }}>No broker. No registration.</span>
            <h2 className="section-heading" style={{ position: 'relative', marginBottom: 14 }}>
              Ready to know your <em>property's worth?</em>
            </h2>
            <p className="body-lg" style={{ marginBottom: 28, position: 'relative' }}>AI-powered transparency for Indore's real estate market.</p>
            <Link to="/valuate" className="btn btn-accent" style={{ padding: '13px 32px', position: 'relative' }}>
              Get Your Free Valuation
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
