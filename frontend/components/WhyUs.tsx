"use client";

import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ShieldCheck, MapPin, Brain } from "lucide-react";

const container = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.15, duration: 0.5 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function WhyUs() {
  return (
    <section className="bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold mb-2">Why Use Our Valuation System?</h2>
          <p className="text-slate-600 text-sm md:text-base">
            Designed for real buyers &amp; sellers – get clarity before you negotiate. 🤝
          </p>
        </motion.div>

        <motion.div
          className="grid gap-6 md:grid-cols-3"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div variants={item}>
            <Card className="border border-slate-200 bg-white rounded-2xl shadow-sm hover:shadow-soft hover:-translate-y-1 transition-all duration-200">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand/10 text-brand">
                    <ShieldCheck className="h-5 w-5" />
                  </span>
                  <CardTitle className="text-lg">Free & Transparent</CardTitle>
                </div>
                <CardDescription>
                  Get valuation estimates without any fee or hidden charges. No
                  broker agenda, just clean numbers for you.
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="border border-slate-200 bg-white rounded-2xl shadow-sm hover:shadow-soft hover:-translate-y-1 transition-all duration-200">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <MapPin className="h-5 w-5" />
                  </span>
                  <CardTitle className="text-lg">Locality-Specific</CardTitle>
                </div>
                <CardDescription>
                  Focused on <b>Vigyan Nagar, Indore</b> with realistic
                  per-sqft pricing and property patterns from the locality.
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="border border-slate-200 bg-white rounded-2xl shadow-sm hover:shadow-soft hover:-translate-y-1 transition-all duration-200">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                    <Brain className="h-5 w-5" />
                  </span>
                  <CardTitle className="text-lg">ML-Powered Insights</CardTitle>
                </div>
                <CardDescription>
                  Uses features like BHK, area, age, facing and amenities to
                  estimate a fair valuation range instead of a random guess.
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
