import React from 'react'

const Step = ({n,icon,title,desc})=> (
  <div className="bg-white p-4 rounded-2xl shadow">
    <div className="text-blue-500 font-bold">Step {n} — {title}</div>
    <div className="text-sm text-gray-600 mt-2">{desc}</div>
  </div>
)

export default function HowItWorks(){
  return (
    <section id="how" className="mt-8">
      <h2 className="text-2xl font-bold text-white">How IntelliValue Works</h2>
      <div className="grid md:grid-cols-3 gap-4 mt-4">
        <Step n={1} title="Validation Agent" desc="Checks your inputs for anomalies and unrealistic values" />
        <Step n={2} title="Valuation Agent" desc="XGBoost model analyses 19 property factors and predicts fair market value" />
        <Step n={3} title="Explanation Agent" desc="Groq LLaMA3 AI explains your valuation in plain language" />
      </div>
    </section>
  )
}
