import React from 'react'

const Stat = ({num,label})=> (
  <div className="bg-white p-6 rounded-2xl shadow text-center">
    <div className="text-3xl font-bold text-blue-500">{num}</div>
    <div className="text-sm text-gray-600 mt-2">{label}</div>
  </div>
)

export default function StatsSection(){
  return (
    <section className="grid md:grid-cols-4 gap-4 mt-8">
      <Stat num={"900+"} label={"Properties Analysed"} />
      <Stat num={"26"} label={"Indore Localities"} />
      <Stat num={"2.3%"} label={"Prediction Accuracy"} />
      <Stat num={"3"} label={"AI Agents Working"} />
    </section>
  )
}
