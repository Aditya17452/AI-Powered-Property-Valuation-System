export default function History() {
  const eras = [
    {
      year: '~3000 BC',
      era: 'Ancient Civilizations',
      icon: '🏛️',
      title: 'Land as Power',
      color: '#92400e',
      borderColor: '#b45309',
      desc: 'In ancient Mesopotamia and Egypt, land value was determined by rulers and priests. Fertile land near rivers commanded the highest "value" — measured not in currency but in grain, livestock, or labor. The first recorded land transactions appear in Sumerian clay tablets around 2500 BC.',
      method: 'Royal decree + Proximity to water + Fertility',
      accuracy: '❌ Highly subjective',
    },
    {
      year: '1086 AD',
      era: 'Medieval Period',
      icon: '📜',
      title: 'The Domesday Book',
      color: '#1e3a5f',
      borderColor: '#1d4ed8',
      desc: 'William the Conqueror commissioned England\'s first systematic property survey — the Domesday Book. Every manor, field, and mill was recorded with its annual value in shillings. This was humanity\'s first attempt at standardized property valuation at scale.',
      method: 'Crown survey + Manorial income + Agricultural yield',
      accuracy: '⚠️ Standardized but static',
    },
    {
      year: '1600–1800',
      era: 'Colonial & Industrial Era',
      icon: '🏭',
      title: 'Comparable Sales Method',
      color: '#1c3a1c',
      borderColor: '#16a34a',
      desc: 'As urban centers grew, valuers began comparing properties to recent sales of similar properties nearby — the "comparable sales" or "comps" method. In British India, land revenue assessments shaped property values for generations. The concept of "circle rates" in India traces directly to colonial-era government assessments.',
      method: 'Comparable sales + Location + Government assessment',
      accuracy: '⚠️ Better, but broker-dependent',
    },
    {
      year: '1900–1970',
      era: 'Professional Valuation',
      icon: '🧑‍💼',
      title: 'The Rise of the Valuer',
      color: '#1a1a3e',
      borderColor: '#7c3aed',
      desc: 'Licensed appraisers and valuers emerged as a profession. Three formal approaches codified: the Sales Comparison Approach, the Income Approach (for rental properties), and the Cost Approach (replacement cost). RICS (Royal Institution of Chartered Surveyors) standardized global practices.',
      method: 'Sales comparison + Income capitalization + Replacement cost',
      accuracy: '⚠️ Professional but expensive & slow',
    },
    {
      year: '1990–2010',
      era: 'Digital Listings Era',
      icon: '💻',
      title: 'The Internet Disrupts',
      color: '#1a2e1a',
      borderColor: '#059669',
      desc: 'Platforms like 99acres (2005), MagicBricks (2006), and Zillow (USA, 2006) democratized property listings. Anyone could now see asking prices. However, listing price ≠ market price — these platforms showed what sellers wanted, not what buyers paid. Zillow\'s "Zestimate" (2006) was the first mass-market AVM.',
      method: 'Listing aggregation + Historical trends + ML (basic)',
      accuracy: '⚠️ Listing price bias, not actual transactions',
    },
    {
      year: '2010–2020',
      era: 'Big Data & Machine Learning',
      icon: '📊',
      title: 'AVMs Go Mainstream',
      color: '#1a1a2e',
      borderColor: '#6366f1',
      desc: 'Automated Valuation Models (AVMs) using Random Forest, Gradient Boosting, and neural networks emerged. Banks started using ML models for mortgage risk assessment. However, most models struggled in Tier-2/3 Indian cities due to data scarcity and the gap between circle rates and actual transaction prices.',
      method: 'XGBoost + Random Forest + Historical transaction data',
      accuracy: '✅ Good for Tier-1, ⚠️ Limited in Tier-2/3',
    },
    {
      year: '2023–Present',
      era: 'Agentic AI Era',
      icon: '🤖',
      title: 'Explainable AI Valuation',
      color: '#0a1628',
      borderColor: '#f59e0b',
      desc: 'Large Language Models (LLMs) combined with trained ML models enable not just prediction but explanation. SHAP values reveal which factors drive each valuation. Agentic pipelines validate inputs, predict values, and generate natural-language explanations — all automatically. This is what IntelliValue does.',
      method: 'XGBoost + SHAP explainability + Groq LLaMA3 explanation',
      accuracy: '✅ 97%+ R², 2.3% MAPE, fully explainable',
    },
    {
      year: '2025 — IntelliValue',
      era: 'Indore-Specific AI',
      icon: '🏙️',
      title: 'Built for Indore\'s Market',
      color: 'rgba(37,99,235,0.1)',
      borderColor: 'var(--blue-light)',
      desc: 'IntelliValue is trained specifically on 900+ Indore properties across 26 localities. It accounts for MP IGRS circle rates, Indore\'s rapid infrastructure development (Smart City project, Metro), and locality-specific demand patterns. The 3-agent pipeline catches input errors, predicts fair value, and explains the result in plain language.',
      method: '19 engineered features + Validation Agent + Valuation Agent + Explanation Agent (Groq)',
      accuracy: '✅ R² = 0.9953 · MAPE = 2.33% · 5-fold CV stable',
      highlight: true,
    },
  ]

  return (
    <div className="page" style={{ paddingTop: 100 }}>
      <div className="bg-mesh" />
      <div className="container" style={{ paddingBottom: 100 }}>

        {/* Header */}
        <div style={{ textAlign:'center', marginBottom: 72, maxWidth: 680, margin:'0 auto 72px' }}>
          <div className="label" style={{ marginBottom: 12 }}>The Story of Valuation</div>
          <h1 className="section-title fade-up">
            From Clay Tablets to <span className="text-gradient">AI Agents</span>
          </h1>
          <p className="fade-up fade-up-1" style={{ color:'var(--gray)', marginTop: 16, lineHeight: 1.75, fontSize:'1.05rem' }}>
            Property valuation is one of humanity's oldest problems. For 5,000 years,
            humans have tried to answer: <em style={{ color:'#93c5fd' }}>"What is this land worth?"</em>
            Here's how the methods evolved — and how we got to AI.
          </p>
        </div>

        {/* Timeline */}
        <div style={{ position:'relative', maxWidth: 820, margin:'0 auto' }}>
          {/* Vertical line */}
          <div style={{
            position:'absolute', left: 32, top: 0, bottom: 0,
            width: 2,
            background: 'linear-gradient(180deg, var(--blue) 0%, rgba(245,158,11,0.8) 85%, var(--gold) 100%)'
          }} />

          {eras.map((era, i) => (
            <div key={i} className="fade-up" style={{ animationDelay:`${i*0.08}s`, paddingLeft: 80, paddingBottom: 40, position:'relative' }}>
              {/* Dot */}
              <div style={{
                position:'absolute', left: 22, top: 6,
                width: 22, height: 22,
                background: era.highlight ? 'var(--gold)' : 'var(--navy-2)',
                border: `2px solid ${era.borderColor}`,
                borderRadius: '50%',
                boxShadow: `0 0 12px ${era.borderColor}`,
                zIndex: 2
              }} />

              <div className="hist-card" style={{
                borderLeftColor: era.borderColor,
                background: era.highlight ? 'rgba(37,99,235,0.08)' : 'var(--card-bg)',
                boxShadow: era.highlight ? `0 0 40px rgba(37,99,235,0.15)` : undefined
              }}>
                <div style={{ display:'flex', alignItems:'flex-start', gap: 16, marginBottom: 16 }}>
                  <div style={{ fontSize: '2.2rem', flexShrink: 0 }}>{era.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display:'flex', alignItems:'center', gap: 12, flexWrap:'wrap', marginBottom: 6 }}>
                      <div className="hist-year">{era.year}</div>
                      <div className="badge" style={{
                        background: 'rgba(255,255,255,0.05)',
                        borderColor: era.borderColor,
                        color: era.borderColor,
                        fontSize: '0.72rem'
                      }}>{era.era}</div>
                    </div>
                    <h3 style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'1.15rem', marginBottom: 12 }}>
                      {era.title}
                    </h3>
                    <p style={{ color:'var(--gray)', lineHeight: 1.75, fontSize:'0.92rem', marginBottom: 16 }}>{era.desc}</p>
                    <div style={{ display:'flex', flexDirection:'column', gap: 8 }}>
                      <div style={{ display:'flex', gap: 10, alignItems:'flex-start', fontSize:'0.82rem' }}>
                        <span style={{ color:'var(--gray-2)', fontWeight:600, minWidth:80, textTransform:'uppercase', letterSpacing:'0.06em', fontSize:'0.72rem' }}>Method</span>
                        <span style={{ color:'#94a3b8' }}>{era.method}</span>
                      </div>
                      <div style={{ display:'flex', gap: 10, alignItems:'center', fontSize:'0.82rem' }}>
                        <span style={{ color:'var(--gray-2)', fontWeight:600, minWidth:80, textTransform:'uppercase', letterSpacing:'0.06em', fontSize:'0.72rem' }}>Accuracy</span>
                        <span style={{ color: era.highlight ? '#6ee7b7' : '#94a3b8' }}>{era.accuracy}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div style={{ textAlign:'center', marginTop: 60 }}>
          <p style={{ color:'var(--gray)', marginBottom: 24, fontSize:'1rem' }}>
            5,000 years of evolution — and IntelliValue brings the best of it to Indore.
          </p>
          <a href="/valuate" className="btn btn-primary" style={{ padding:'16px 40px', fontSize:'1rem' }}>
            Try IntelliValue Now →
          </a>
        </div>

      </div>
    </div>
  )
}
