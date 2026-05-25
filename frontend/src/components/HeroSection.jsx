import React from 'react'
import { motion } from 'framer-motion'

export default function HeroSection(){
  return (
    <section className="min-h-[70vh] flex items-center pt-24">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-8 p-4">
        <div className="flex-1 text-white">
          <div className="inline-block bg-white/10 px-3 py-1 rounded-full">🏠 AI-Powered for Indore</div>
          <h1 className="text-4xl font-bold mt-4">Know the True Value of Your Property</h1>
          <p className="mt-4 text-gray-200">Stop guessing. Our AI analyses 19+ market factors to give you Indore's most accurate property valuation — backed by real data, not just listings.</p>
          <div className="mt-6 flex gap-3">
            <a href="/valuate" className="bg-blue-500 text-white px-4 py-2 rounded">Get Free Valuation</a>
            <a href="#how" className="border border-white text-white px-4 py-2 rounded">How it Works</a>
          </div>
          <div className="mt-4 text-sm text-gray-300">✓ 900+ properties analysed &nbsp; ✓ 26 Indore localities &nbsp; ✓ 2.3% average accuracy</div>
        </div>
        <div className="flex-1">
          <motion.div animate={{y:[0,-10,0]}} transition={{duration:3, repeat:Infinity}} className="bg-white p-6 rounded-2xl shadow w-72 mx-auto">
            <div className="text-sm text-gray-500">Vijay Nagar — 3BHK</div>
            <div className="text-2xl font-bold mt-2 text-blue-600">₹47,20,000</div>
            <div className="text-sm text-gray-500 mt-1">₹3,933 / sqft</div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
