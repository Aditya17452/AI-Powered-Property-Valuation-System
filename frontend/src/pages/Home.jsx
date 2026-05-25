import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

// ── Count-up hook ──────────────────────────────────────────────────────────
function useCountUp(target, duration = 1800, start = false) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!start) return
    let startTime = null
    const step = (ts) => {
      if (!startTime) startTime = ts
      const progress = Math.min((ts - startTime) / duration, 1)
      const ease = 1 - Math.pow(1 - progress, 3)
      setVal(Math.floor(ease * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [start, target, duration])
  return val
}

// ── Stat card ──────────────────────────────────────────────────────────────
function StatCard({ value, suffix, label, delay, started }) {
  const num = useCountUp(value, 1800, started)
  return (
    <div className="card fade-up" style={{ padding: '32px 24px', textAlign: 'center', animationDelay: `${delay}s` }}>
      <div className="count-number" style={{ fontSize: 'clamp(2rem,4vw,3rem)' }}>
        {num}{suffix}
      </div>
      <div style={{ color: 'var(--gray)', marginTop: 8, fontWeight: 500, fontSize: '0.95rem' }}>{label}</div>
    </div>
  )
}

// ── Step card ──────────────────────────────────────────────────────────────
function StepCard({ icon, title, desc, color, num, delay }) {
  return (
    <div className="step-card fade-up" style={{ animationDelay: `${delay}s` }}>
      <div className="step-number">{num}</div>
      <div className="step-icon-wrap" style={{ background: color }}>{icon}</div>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 700, marginBottom: 10 }}>{title}</h3>
      <p style={{ color: 'var(--gray)', lineHeight: 1.65, fontSize: '0.92rem' }}>{desc}</p>
    </div>
  )
}

export default function Home() {
  const statsRef = useRef(null)
  const [statsStarted, setStatsStarted] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStatsStarted(true) }, { threshold: 0.3 })
    if (statsRef.current) obs.observe(statsRef.current)
    return () => obs.disconnect()
  }, [])

  return (
    <div className="page">
      <div className="bg-mesh" />

      {/* ── HERO ── */}
      <section className="hero-section" style={{ display: 'flex', alignItems: 'center' }}>
        <div className="container">
          <div className="hero-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'center' }}>

            {/* Left */}
            <div>
              <div className="badge badge-blue fade-up" style={{ marginBottom: 20 }}>
                <span>🏠</span> AI-Powered for Indore
              </div>
              <h1 className="display-1 fade-up fade-up-1" style={{ marginBottom: 18, maxWidth: 560 }}>
                Know the{' '}
                <span className="text-gradient">True Value</span>
                <br />of Your Property
              </h1>
              <p className="fade-up fade-up-2" style={{ color: 'var(--gray)', fontSize: '0.98rem', lineHeight: 1.7, maxWidth: 500, marginBottom: 24 }}>
                Stop relying on brokers and guesswork. IntelliValue's 3-agent AI pipeline analyses
                19+ market factors to give Indore's most transparent property valuation.
              </p>
              <div className="fade-up fade-up-3" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 26 }}>
                <Link to="/valuate" className="btn btn-primary">
                  Get Free Valuation
                  <span style={{ fontSize: '1.1rem' }}>→</span>
                </Link>
                <Link to="/history" className="btn btn-outline">
                  How It Works
                </Link>
              </div>
              <div className="fade-up fade-up-4" style={{ display: 'flex', gap: 14, flexWrap: 'wrap', maxWidth: 560 }}>
                {['900+ properties analysed', '26 Indore localities', '95% avg accuracy'].map(t => (
                  <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--gray)', fontSize: '0.8rem' }}>
                    <span style={{ color: 'var(--green)', fontSize: '1rem' }}>✓</span> {t}
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Floating card */}
              <div className="hero-visual" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
              {/* Glow blob */}
              <div style={{
                position: 'absolute', width: 420, height: 420,
                background: 'radial-gradient(circle, rgba(37,99,235,0.2) 0%, transparent 70%)',
                borderRadius: '50%', animation: 'meshMove1 8s ease-in-out infinite alternate'
              }} />
              {/* Mock result card */}
                <div className="float-card" style={{
                background: 'rgba(255,255,255,0.07)',
                backdropFilter: 'blur(24px)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 24, padding: 32, width: 320,
                boxShadow: '0 32px 80px rgba(0,0,0,0.4), 0 0 40px rgba(37,99,235,0.2)',
                position: 'relative', zIndex: 2
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--gray)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Vijay Nagar — 3BHK</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--gray)', marginTop: 2 }}>1,200 sqft · Apartment</div>
                  </div>
                  <div className="badge badge-green" style={{ fontSize: '0.7rem' }}>Fair Value</div>
                </div>
                <div className="price-display" style={{ marginBottom: 6 }}>₹47,20,000</div>
                <div style={{ color: 'var(--gray)', fontSize: '0.85rem', marginBottom: 20 }}>₹3,933 / sqft</div>
                <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', marginBottom: 16 }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[
                    { label: 'Location premium', val: '+18%', color: 'var(--green)' },
                    { label: 'Age discount',      val: '-7%',  color: '#f87171' },
                    { label: 'Amenity score',     val: '+5%',  color: 'var(--green)' },
                  ].map(f => (
                    <div key={f.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                      <span style={{ color: 'var(--gray)' }}>{f.label}</span>
                      <span style={{ color: f.color, fontWeight: 600 }}>{f.val}</span>
                    </div>
                  ))}
                </div>
                {/* Agent dots */}
                <div style={{ display: 'flex', gap: 6, marginTop: 20, justifyContent: 'flex-end' }}>
                  {['🛡', '🧮', '✨'].map((e, i) => (
                    <div key={i} style={{
                      width: 28, height: 28, borderRadius: '50%',
                      background: 'rgba(16,185,129,0.2)',
                      border: '1px solid rgba(16,185,129,0.4)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.75rem'
                    }}>{e}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="glow-line" />

      {/* ── STATS ── */}
      <section className="section-sm" ref={statsRef}>
        <div className="container">
          <div className="grid-4 stagger">
            <StatCard value={900} suffix="+" label="Properties Analysed" delay={0} started={statsStarted} />
            <StatCard value={26} suffix="" label="Indore Localities" delay={0.08} started={statsStarted} />
            <StatCard value={95} suffix="%" label="Prediction Accuracy" delay={0.16} started={statsStarted} />
            <StatCard value={3} suffix="" label="AI Agents Working" delay={0.24} started={statsStarted} />
          </div>
        </div>
      </section>

      <div className="glow-line" />

      {/* ── HOW IT WORKS ── */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <div className="label" style={{ marginBottom: 12 }}>The Process</div>
            <h2 className="section-title">
              How <span className="text-gradient">IntelliValue</span> Works
            </h2>
            <p style={{ color: 'var(--gray)', maxWidth: 520, margin: '16px auto 0', lineHeight: 1.7 }}>
              A 3-agent agentic pipeline that validates, predicts, and explains — giving you
              transparency that no listing platform provides.
            </p>
          </div>

          <div className="grid-3">
            <StepCard
              icon="🛡" num="01"
              title="Validation Agent"
              desc="Rule-based agent that checks your inputs for anomalies — catches impossible combinations like 3BHK in 400sqft or prices 5x above market rate."
              color="rgba(59,130,246,0.15)"
              delay={0.1}
            />
            <StepCard
              icon="🧮" num="02"
              title="Valuation Agent"
              desc="Our XGBoost model trained on 900+ Indore properties analyses 19 factors: locality, area, age, amenities, circle rates, distance from city centre, and more."
              color="rgba(245,158,11,0.15)"
              delay={0.2}
            />
            <StepCard
              icon="✨" num="03"
              title="Explanation Agent"
              desc="Groq's LLaMA3 AI reads your valuation result and writes a plain-language explanation of why your property is priced the way it is — specific to your locality."
              color="rgba(16,185,129,0.15)"
              delay={0.3}
            />
          </div>

          <div style={{ textAlign: 'center', marginTop: 56 }}>
            <Link to="/valuate" className="btn btn-primary" style={{ padding: '16px 40px', fontSize: '1rem' }}>
              Try It Now — It's Free →
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="section-sm">
        <div className="container">
          <div style={{
            background: 'linear-gradient(135deg, rgba(37,99,235,0.2) 0%, rgba(245,158,11,0.1) 100%)',
            border: '1px solid rgba(59,130,246,0.3)',
            borderRadius: 24, padding: '60px 40px', textAlign: 'center',
            backdropFilter: 'blur(20px)', position: 'relative', overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute', inset: 0,
              background: 'radial-gradient(circle at 50% 50%, rgba(37,99,235,0.1) 0%, transparent 70%)',
              pointerEvents: 'none'
            }} />
            <h2 className="section-title" style={{ marginBottom: 16, position: 'relative' }}>
              Ready to know what your <span className="text-gradient">property is worth?</span>
            </h2>
            <p style={{ color: 'var(--gray)', marginBottom: 32, fontSize: '1.05rem', position: 'relative' }}>
              No registration. No broker. Just AI-powered transparency.
            </p>
            <Link to="/valuate" className="btn btn-gold" style={{ padding: '16px 40px', fontSize: '1rem', position: 'relative' }}>
              Get Your Free Valuation
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
