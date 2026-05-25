"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* soft blobs */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-blue-300/40 blur-3xl" />
      <div className="pointer-events-none absolute -left-24 bottom-0 h-64 w-64 rounded-full bg-indigo-300/40 blur-3xl" />

      <motion.div
        className="relative max-w-6xl mx-auto px-4 md:px-6 flex flex-col items-center text-center gap-6"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-1 text-xs md:text-sm font-medium text-slate-700 border border-slate-200 shadow-soft">
          🏠 Smart • 🎯 Accurate • 💰 Free
        </span>

        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight mt-4">
          Property Valuation
          <span className="block text-2xl md:text-4xl font-semibold text-slate-700 mt-2">
            ML-Powered Price Estimator for Your Home
          </span>
        </h1>

        <p className="max-w-2xl text-sm md:text-lg text-slate-600">
          Enter your property details and get an instant{" "}
          <span className="font-semibold">valuation range</span> for residential
          properties in <span className="font-semibold">Vigyan Nagar, Indore</span>.  
          No brokers, no commission – just data-driven insights. 📊
        </p>

        {/* CTA BUTTONS */}
<div className="flex flex-col sm:flex-row gap-4 mt-2">

  {/* PRIMARY */}
  <Link
    href="/valuation"
    className="inline-flex items-center justify-center rounded-full px-8 py-4 text-sm md:text-base font-semibold border border-brand text-brand bg-white/90 backdrop-blur-sm shadow-md hover:bg-brand/10 transition"
  >
    ✨ Check Property Value
  </Link>

  {/* SECONDARY */}
  <Link
    href="/about"
    className="inline-flex items-center justify-center rounded-full px-8 py-4 text-sm md:text-base font-semibold border border-brand text-brand bg-white/90 backdrop-blur-sm shadow-md hover:bg-brand/10 transition"
  >
    ℹ️ Learn More
  </Link>

</div>


        <p className="text-xs md:text-sm text-slate-500 mt-2 mb-4">
          Powered by regression-based ML model • Version 1.0 – Vigyan Nagar
        </p>
      </motion.div>
    </section>
  );
}
