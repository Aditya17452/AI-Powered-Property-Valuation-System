import React from 'react'

export default function AgentStatusBar({loading}){
  const status = loading ? ['running','waiting','waiting'] : ['done','done','done']
  const steps = ['Validation Agent','Valuation Agent','Explanation Agent']
  return (
    <div className="bg-white p-4 rounded-2xl shadow mb-4">
      <div className="flex items-center justify-between">
        {steps.map((s,i)=> (
          <div key={s} className="flex-1 text-center">
            <div className={`mx-auto w-8 h-8 rounded-full ${status[i]==='done'? 'bg-green-400':'bg-blue-400'}`}>{i+1}</div>
            <div className="text-sm mt-2">{s}</div>
            <div className="text-xs text-gray-500">{status[i]==='running'? 'Running...': status[i]==='done' ? 'Done' : 'Waiting'}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
