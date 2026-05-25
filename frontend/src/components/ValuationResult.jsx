import React from 'react'

export default function ValuationResult({result}){
  const v = result
  return (
    <div className="bg-white p-6 rounded-2xl shadow mt-4">
      <h4 className="font-bold">Estimated Market Value</h4>
      <div className="text-3xl text-blue-600 font-bold mt-2">₹{v.predicted_value.toLocaleString('en-IN')}</div>
      <div className="text-sm text-gray-600">₹{v.predicted_per_sqft.toLocaleString('en-IN')} / sqft</div>
      <div className="mt-4">Verdict: <span className="px-2 py-1 bg-green-100 rounded">{v.valuation_verdict}</span></div>
      <div className="mt-4">Confidence Range: ₹{v.confidence_band.low.toLocaleString('en-IN')} - ₹{v.confidence_band.high.toLocaleString('en-IN')}</div>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="p-3 bg-gray-50 rounded">Your Property<br/><strong>₹{v.predicted_value.toLocaleString('en-IN')}</strong></div>
        <div className="p-3 bg-gray-50 rounded">Locality Avg<br/><strong>₹{v.locality_avg.toLocaleString('en-IN')}</strong></div>
      </div>
      {v.validation && v.validation.warnings && v.validation.warnings.length>0 && (
        <div className="mt-4">
          {v.validation.warnings.map((w,i)=> <div key={i} className="bg-yellow-100 p-2 rounded mt-2">⚠ {w}</div>)}
        </div>
      )}
    </div>
  )
}
