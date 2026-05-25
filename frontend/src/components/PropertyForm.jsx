import React, {useEffect, useState} from 'react'
import { getLocalities } from '../api/valuationApi'

export default function PropertyForm({onSubmit,loading}){
  const [localities,setLocalities] = useState([])
  const [form,setForm] = useState({
    locality:'Vijay Nagar', property_type:'Apartment', area_sqft:800, bhk:2, age_category:'5-10 years', facing:'North', road_connectivity:'Average', crime_rate:'Medium', nearby_schools:'Yes', nearby_hospitals:'Yes', nearby_markets:'Yes', future_projects:'No', owner_type:'Owner', listing_price:''
  })

  useEffect(()=>{getLocalities().then(d=>setLocalities(d.localities || []))},[])

  const submit = (e)=>{
    e.preventDefault();
    const payload = {...form}
    if(payload.listing_price==='') delete payload.listing_price
    onSubmit(payload)
  }

  return (
    <form onSubmit={submit} className="bg-white p-6 rounded-2xl shadow">
      <h3 className="font-bold">Property Details</h3>
      <div className="grid grid-cols-2 gap-3 mt-4">
        <select value={form.locality} onChange={e=>setForm({...form,locality:e.target.value})} className="p-2 border rounded">
          {localities.map(l=> <option key={l} value={l}>{l}</option>)}
        </select>
        <select value={form.property_type} onChange={e=>setForm({...form,property_type:e.target.value})} className="p-2 border rounded">
          <option>Apartment</option>
          <option>Plot</option>
          <option>Independent House</option>
        </select>
        <input type="number" value={form.area_sqft} onChange={e=>setForm({...form,area_sqft:e.target.value})} className="p-2 border rounded" />
        <select value={form.bhk} onChange={e=>setForm({...form,bhk:e.target.value})} className="p-2 border rounded">
          {[0,1,2,3,4,5].map(n=> <option key={n} value={n}>{n} BHK</option>)}
        </select>
        <select value={form.age_category} onChange={e=>setForm({...form,age_category:e.target.value})} className="p-2 border rounded">
          <option>0-5 years</option>
          <option>5-10 years</option>
          <option>10-20 years</option>
          <option>20+ years</option>
        </select>
        <select value={form.facing} onChange={e=>setForm({...form,facing:e.target.value})} className="p-2 border rounded">
          <option>North</option>
          <option>East</option>
          <option>West</option>
          <option>South</option>
        </select>
        <select value={form.road_connectivity} onChange={e=>setForm({...form,road_connectivity:e.target.value})} className="p-2 border rounded">
          <option>Excellent</option>
          <option>Good</option>
          <option>Average</option>
          <option>Poor</option>
        </select>
        <select value={form.crime_rate} onChange={e=>setForm({...form,crime_rate:e.target.value})} className="p-2 border rounded">
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
        <div className="col-span-2 flex gap-2 items-center">
          <label className="flex items-center gap-2"><input type="checkbox" checked={form.nearby_schools==='Yes'} onChange={e=>setForm({...form,nearby_schools: e.target.checked? 'Yes':'No'})} /> Nearby Schools</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={form.nearby_hospitals==='Yes'} onChange={e=>setForm({...form,nearby_hospitals: e.target.checked? 'Yes':'No'})} /> Nearby Hospitals</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={form.nearby_markets==='Yes'} onChange={e=>setForm({...form,nearby_markets: e.target.checked? 'Yes':'No'})} /> Nearby Markets</label>
        </div>
        <div className="col-span-2 flex gap-2 items-center">
          <label className="flex items-center gap-2"><input type="checkbox" checked={form.future_projects==='Yes'} onChange={e=>setForm({...form,future_projects: e.target.checked? 'Yes':'No'})} /> Future Projects Nearby</label>
          <label className="flex items-center gap-2">Owner Type: <select value={form.owner_type} onChange={e=>setForm({...form,owner_type:e.target.value})} className="p-1 ml-2"><option>Owner</option><option>Dealer</option></select></label>
        </div>
        <input placeholder="Listing Price (optional)" value={form.listing_price} onChange={e=>setForm({...form,listing_price:e.target.value})} className="p-2 border rounded col-span-2" />
      </div>
      <button type="submit" disabled={loading} className="mt-4 w-full bg-gradient-to-r from-blue-500 to-blue-400 text-white py-3 rounded">{loading? 'Analysing with AI...':'Get AI Valuation →'}</button>
    </form>
  )
}
