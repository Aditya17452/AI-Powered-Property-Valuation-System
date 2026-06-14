import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { predictProperty, getLocalities } from '../api/valuationApi'
import { useAuth } from '../context/AuthContext'

// ── Agent Status Bar ───────────────────────────────────────────────────────
function AgentStatusBar({ status }) {
  const steps = [
    { key: 'validation',  icon: '🛡', name: 'Validation Agent',  desc: { waiting:'Awaiting input', running:'Checking inputs...', done:'Inputs verified ✓' } },
    { key: 'valuation',   icon: '🧮', name: 'Valuation Agent',   desc: { waiting:'Standby', running:'Running XGBoost...', done:'Price predicted ✓' } },
    { key: 'explanation', icon: '✨', name: 'Explanation Agent', desc: { waiting:'Standby', running:'Generating AI explanation...', done:'Explanation ready ✓' } },
  ]
  return (
    <div className="card fade-up" style={{ padding: 28, marginBottom: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
        {steps.map((s, i) => (
          <div key={s.key} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <div className="agent-step">
              <div className={`step-circle ${status[s.key]}`}>
                {status[s.key] === 'done' ? '✓' : status[s.key] === 'running'
                  ? <div className="spinner" style={{ width:18, height:18 }} />
                  : s.icon}
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: status[s.key] === 'done' ? 'var(--green)' : status[s.key] === 'running' ? 'var(--blue-light)' : 'var(--gray)' }}>
                  {s.name}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--gray-2)', marginTop: 2 }}>
                  {s.desc[status[s.key]]}
                </div>
              </div>
            </div>
            {i < steps.length - 1 && (
              <div className={`step-connector ${status[steps[i+1].key] !== 'waiting' ? 'active' : ''}`} style={{ flex: 1, margin: '0 8px', marginTop: -28 }} />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Toggle ────────────────────────────────────────────────────────────────
function Toggle({ label, value, onChange }) {
  return (
    <div className="toggle-wrap" onClick={() => onChange(!value)}>
      <div className={`toggle ${value ? 'on' : ''}`} />
      <span className="toggle-label">{label}</span>
    </div>
  )
}

// ── Result display ────────────────────────────────────────────────────────
function CountUp({ target, duration = 1500 }) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    let start = null
    const step = (ts) => {
      if (!start) start = ts
      const p = Math.min((ts - start) / duration, 1)
      const e = 1 - Math.pow(1 - p, 3)
      setVal(Math.floor(e * target))
      if (p < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration])
  return <>{val.toLocaleString('en-IN')}</>
}

function TypeWriter({ text, speed = 18 }) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)
  useEffect(() => {
    setDisplayed('')
    setDone(false)
    let i = 0
    const id = setInterval(() => {
      if (i < text.length) { setDisplayed(text.slice(0, ++i)) }
      else { clearInterval(id); setDone(true) }
    }, speed)
    return () => clearInterval(id)
  }, [text, speed])
  return <span>{displayed}{!done && <span className="typewriter" />}</span>
}

// ── Main Valuate page ─────────────────────────────────────────────────────
const LOCALITIES = [
  'Vijay Nagar','Scheme 54','Palasia','AB Road','Aerodrome Road',
  'Nipania','Super Corridor','Bhawarkuan','Rajendra Nagar','Mahalaxmi Nagar',
  'Niranjanpur','MR 10','Pipliyahana','Pardesipura','Tilak Nagar',
  'Annapurna','Bicholi Mardana','Kanadiya','Banganga','LIG Colony',
  'Sudama Nagar','Rau','Limbodi','Bicholi Hapsi','Silicon City','Vigyan Nagar'
]

const initialForm = {
  locality:'Vijay Nagar', property_type:'Apartment', area_sqft:'',
  bhk:'2', age_category:'0-5 years', facing:'North',
  road_connectivity:'Good', crime_rate:'Medium',
  nearby_schools:false, nearby_hospitals:false, nearby_markets:false,
  future_projects:false, owner_type:'Owner', listing_price:''
}

export default function Valuate() {
  const { user } = useAuth()
  const [form, setForm] = useState(initialForm)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [agentStatus, setAgentStatus] = useState({ validation:'waiting', valuation:'waiting', explanation:'waiting' })
  const resultRef = useRef(null)

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const runAgentAnimation = () => {
    setAgentStatus({ validation:'running', valuation:'waiting', explanation:'waiting' })
    setTimeout(() => setAgentStatus({ validation:'done', valuation:'running', explanation:'waiting' }), 900)
    setTimeout(() => setAgentStatus({ validation:'done', valuation:'done', explanation:'running' }), 1900)
  }

  const handleSubmit = async () => {
    if (!form.area_sqft || form.area_sqft <= 0) { setError('Please enter a valid area in sqft.'); return }
    setError(null); setLoading(true); setResult(null)
    runAgentAnimation()
    try {
      const payload = {
        ...form,
        area_sqft: Number(form.area_sqft),
        bhk: Number(form.bhk),
        listing_price: form.listing_price ? Number(form.listing_price) : null,
        nearby_schools: form.nearby_schools ? 'Yes' : 'No',
        nearby_hospitals: form.nearby_hospitals ? 'Yes' : 'No',
        nearby_markets: form.nearby_markets ? 'Yes' : 'No',
        future_projects: form.future_projects ? 'Yes' : 'No',
      }
      const data = await predictProperty(payload)
      setAgentStatus({ validation:'done', valuation:'done', explanation:'done' })
      setResult(data)
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior:'smooth', block:'nearest' }), 100)
    } catch (e) {
      setAgentStatus({ validation:'waiting', valuation:'waiting', explanation:'waiting' })
      setError(e?.response?.data?.detail || 'Something went wrong. Is the backend running?')
    }
    setLoading(false)
  }

  const verdictColor = result ? (
    result.valuation_verdict?.includes('Above') ? 'var(--gold)' :
    result.valuation_verdict?.includes('Below') ? '#f87171' : 'var(--green)'
  ) : 'var(--green)'

  const SelectField = ({ label, name, options }) => (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <select className="form-control" value={form[name]} onChange={e => set(name, e.target.value)}>
        {options.map(o => <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>)}
      </select>
    </div>
  )

  return (
    <div className="page">
      <div className="bg-mesh" />
      <div className="container" style={{ paddingBottom: 80 }}>

        {!user && (
          <div className="auth-banner">
            <span>💡</span>
            <span>
              <Link to="/login" style={{ color: 'inherit', fontWeight: 600, textDecoration: 'underline' }}>Sign in</Link>
              {' '}to save your valuation history across sessions.
            </span>
          </div>
        )}

        <div style={{ textAlign:'center', marginBottom: 48 }}>
          <div className="label" style={{ marginBottom: 10 }}>AI Valuation Engine</div>
          <h1 className="section-title fade-up">Get Your <span className="text-gradient">Property Valuation</span></h1>
          <p style={{ color:'var(--gray)', marginTop: 12, fontSize:'1rem' }}>Fill in your property details and our 3-agent AI pipeline will analyse the fair market value.</p>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 28, alignItems:'start' }}>

          {/* ── FORM ── */}
          <div className="card fade-up" style={{ padding: 32 }}>
            <h2 style={{ fontFamily:'var(--font-display)', fontSize:'1.2rem', fontWeight:700, marginBottom: 24 }}>
              🏡 Property Details
            </h2>

            <div style={{ display:'flex', flexDirection:'column', gap: 18 }}>
              <div className="grid-2">
                <SelectField label="Locality" name="locality" options={LOCALITIES} />
                <SelectField label="Property Type" name="property_type" options={['Apartment','Villa','Independent House','Builder Floor','Plot']} />
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Area (sqft) *</label>
                  <input className="form-control" type="number" placeholder="e.g. 1200" value={form.area_sqft} onChange={e => set('area_sqft', e.target.value)} />
                </div>
                <SelectField label="BHK" name="bhk" options={[
                  {value:'0',label:'Studio/Plot'},{value:'1',label:'1 BHK'},
                  {value:'2',label:'2 BHK'},{value:'3',label:'3 BHK'},
                  {value:'4',label:'4 BHK'},{value:'5',label:'5 BHK'}
                ]} />
              </div>

              <div className="grid-2">
                <SelectField label="Age of Property" name="age_category" options={['0-5 years','5-10 years','10-20 years','20+ years']} />
                <SelectField label="Facing Direction" name="facing" options={['North','South','East','West','North-East','North-West','South-East','South-West']} />
              </div>

              <div className="grid-2">
                <SelectField label="Road Connectivity" name="road_connectivity" options={['Excellent','Good','Average','Poor']} />
                <SelectField label="Crime Rate in Area" name="crime_rate" options={['Low','Medium','High']} />
              </div>

              {/* Toggles */}
              <div style={{ background:'rgba(255,255,255,0.03)', borderRadius:12, padding: 20, border:'1px solid rgba(255,255,255,0.06)' }}>
                <div className="form-label" style={{ marginBottom: 14 }}>Nearby Amenities</div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 14 }}>
                  <Toggle label="🏫 Nearby Schools"    value={form.nearby_schools}   onChange={v => set('nearby_schools', v)} />
                  <Toggle label="🏥 Nearby Hospitals"  value={form.nearby_hospitals} onChange={v => set('nearby_hospitals', v)} />
                  <Toggle label="🛒 Nearby Markets"    value={form.nearby_markets}   onChange={v => set('nearby_markets', v)} />
                  <Toggle label="🔨 Future Projects"   value={form.future_projects}  onChange={v => set('future_projects', v)} />
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Owner Type</label>
                  <div style={{ display:'flex', gap: 10, marginTop: 4 }}>
                    {['Owner','Dealer'].map(o => (
                      <button key={o} type="button" onClick={() => set('owner_type', o)} style={{
                        flex: 1, padding:'10px', borderRadius: 10, cursor:'pointer',
                        background: form.owner_type === o ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.05)',
                        border: `1.5px solid ${form.owner_type === o ? 'var(--blue-light)' : 'rgba(255,255,255,0.1)'}`,
                        color: form.owner_type === o ? '#93c5fd' : 'var(--gray)',
                        fontFamily:'var(--font-body)', fontWeight: 600, fontSize:'0.9rem',
                        transition:'all 0.2s'
                      }}>{o}</button>
                    ))}
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Listing Price (optional)</label>
                  <input className="form-control" type="number" placeholder="₹ e.g. 5500000" value={form.listing_price} onChange={e => set('listing_price', e.target.value)} />
                </div>
              </div>

              {error && (
                <div className="warning-card">
                  <span>⚠</span> {error}
                </div>
              )}

              <button className="btn btn-primary btn-full" onClick={handleSubmit} disabled={loading}>
                {loading ? <><div className="spinner" /> Analysing with AI...</> : <>Get AI Valuation →</>}
              </button>
            </div>
          </div>

          {/* ── RESULTS PANEL ── */}
          <div style={{ display:'flex', flexDirection:'column', gap: 20 }}>

            <AgentStatusBar status={agentStatus} />

            {!result && !loading && (
              <div className="card" style={{ padding: 48, textAlign:'center' }}>
                <div style={{ fontSize: '4rem', marginBottom: 16 }}>🏙️</div>
                <h3 style={{ fontFamily:'var(--font-display)', marginBottom: 8, fontSize:'1.1rem' }}>Your Valuation Will Appear Here</h3>
                <p style={{ color:'var(--gray)', fontSize:'0.9rem', lineHeight: 1.65 }}>
                  Fill in property details and click "Get AI Valuation" to see<br/>
                  the predicted fair market value for your property.
                </p>
              </div>
            )}

            {result && (
              <div ref={resultRef}>
                {/* ── Validation warnings ── */}
                {result.validation?.warnings?.length > 0 && (
                  <div style={{ marginBottom: 16, display:'flex', flexDirection:'column', gap: 8 }}>
                    {result.validation.warnings.map((w, i) => (
                      <div key={i} className="warning-card">⚠ {w}</div>
                    ))}
                  </div>
                )}

                {/* ── Main price card ── */}
                <div className="card card-glow fade-up" style={{ padding: 32, marginBottom: 16 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom: 24 }}>
                    <div>
                      <div className="label" style={{ marginBottom: 8 }}>Estimated Market Value</div>
                      <div className="price-display">
                        ₹<CountUp target={result.predicted_value} />
                      </div>
                      <div style={{ color:'var(--gray)', marginTop: 6, fontSize:'1rem' }}>
                        ₹{result.predicted_per_sqft?.toLocaleString('en-IN')} / sqft
                      </div>
                    </div>
                    <div className="badge" style={{
                      background: verdictColor === 'var(--green)' ? 'rgba(16,185,129,0.15)' : verdictColor === 'var(--gold)' ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)',
                      borderColor: verdictColor, color: verdictColor, fontSize:'0.72rem'
                    }}>
                      {result.valuation_verdict?.includes('Above') ? '↑ Above Avg' : result.valuation_verdict?.includes('Below') ? '↓ Below Avg' : '✓ Fair Value'}
                    </div>
                  </div>

                  {/* Confidence band */}
                  <div style={{ marginBottom: 24 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.8rem', color:'var(--gray)', marginBottom: 10 }}>
                      <span>₹{result.confidence_band?.low?.toLocaleString('en-IN')}</span>
                      <span style={{ color:'var(--gray-2)', fontSize:'0.75rem' }}>95% Confidence Range</span>
                      <span>₹{result.confidence_band?.high?.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="conf-bar">
                      <div className="conf-bar-fill" />
                      <div className="conf-bar-dot" />
                    </div>
                  </div>

                  {/* Comparison */}
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 12 }}>
                    {[
                      { label:'Your Property', val: result.predicted_value, color:'var(--blue-light)' },
                      { label:'Locality Average', val: result.locality_avg, color:'var(--gray)' }
                    ].map(c => (
                      <div key={c.label} style={{ background:'rgba(255,255,255,0.03)', borderRadius:12, padding: 16, border:'1px solid rgba(255,255,255,0.06)' }}>
                        <div style={{ fontSize:'0.75rem', color:'var(--gray)', marginBottom: 6, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.06em' }}>{c.label}</div>
                        <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'1.15rem', color: c.color }}>
                          ₹{c.val?.toLocaleString('en-IN')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── AI Explanation card ── */}
                {result.explanation_text && (
                  <div className="card fade-up" style={{ padding: 28 }}>
                    <div style={{ display:'flex', alignItems:'center', gap: 12, marginBottom: 16 }}>
                      <div style={{ width:40, height:40, borderRadius:12, background:'rgba(59,130,246,0.2)', border:'1px solid rgba(59,130,246,0.3)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.2rem' }}>✨</div>
                      <div>
                        <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'0.95rem' }}>AI Valuation Analyst</div>
                        <div style={{ fontSize:'0.72rem', color:'var(--gray)' }}>Powered by Groq LLaMA3</div>
                      </div>
                      <div className="badge badge-blue" style={{ marginLeft:'auto', fontSize:'0.65rem' }}>AI Generated</div>
                    </div>
                    <p style={{ color:'#cbd5e1', lineHeight: 1.75, fontSize:'0.92rem' }}>
                      <TypeWriter text={result.explanation_text} speed={16} />
                    </p>
                    <div style={{ marginTop:14, paddingTop:14, borderTop:'1px solid rgba(255,255,255,0.06)', fontSize:'0.72rem', color:'var(--gray-2)' }}>
                      Analysis by Groq LLaMA3 · IntelliValue v2.0
                    </div>
                  </div>
                )}

                {/* Verdict text */}
                <div className="card fade-up" style={{ padding: 20, marginTop: 0 }}>
                  <div style={{ display:'flex', gap: 12, alignItems:'flex-start' }}>
                    <span style={{ fontSize:'1.4rem' }}>📊</span>
                    <div>
                      <div style={{ fontWeight:600, fontSize:'0.9rem', marginBottom: 4 }}>Valuation Verdict</div>
                      <div style={{ color:'var(--gray)', fontSize:'0.88rem', lineHeight: 1.6 }}>{result.valuation_verdict}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
