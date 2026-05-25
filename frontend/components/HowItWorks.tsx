"use client";

import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { motion } from "framer-motion";
import { FileText, Cpu, IndianRupee } from "lucide-react";

export default function HowItWorks() {
  return (
    <section>
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold mb-2">How It Works</h2>
          <p className="text-slate-600 text-sm md:text-base">
            Just three simple steps between you and your property’s true worth. 🚀
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="rounded-2xl border-slate-200 relative overflow-hidden bg-white shadow-sm">
              <div className="absolute right-4 top-4 text-5xl font-bold text-slate-100">
                1
              </div>
              <CardHeader>
                <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand/10 text-brand">
                  <FileText className="h-5 w-5" />
                </div>
                <CardTitle>Enter Property Details</CardTitle>
                <CardDescription className="mt-1">
                  Fill in property type, BHK, area in sqft, age, facing direction
                  and basic amenities in the valuation form.
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.45 }}
          >
            <Card className="rounded-2xl border-slate-200 relative overflow-hidden bg-white shadow-sm">
              <div className="absolute right-4 top-4 text-5xl font-bold text-slate-100">
                2
              </div>
              <CardHeader>
                <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                  <Cpu className="h-5 w-5" />
                </div>
                <CardTitle>ML Model Analysis</CardTitle>
                <CardDescription className="mt-1">
                  The model processes your inputs along with locality-wise
                  per-sqft trends and similar properties from the dataset.
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="rounded-2xl border-slate-200 relative overflow-hidden bg-white shadow-sm">
              <div className="absolute right-4 top-4 text-5xl font-bold text-slate-100">
                3
              </div>
              <CardHeader>
                <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <IndianRupee className="h-5 w-5" />
                </div>
                <CardTitle>Get Valuation Range</CardTitle>
                <CardDescription className="mt-1">
                  Instantly see a min–max valuation range, average price and
                  estimated per-sqft rate so you can negotiate confidently.
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
