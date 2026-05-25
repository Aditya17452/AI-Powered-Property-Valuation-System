"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, Instagram, Github, Linkedin } from "lucide-react";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success">(
    "idle"
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");

    
    setTimeout(() => {
      setStatus("success");
    }, 800);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-12 space-y-8">
      <section className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Contact Us</h1>
        <p className="text-slate-600 max-w-2xl mx-auto text-sm md:text-base">
          Have questions about your property valuation, data, or the project?
          Drop a message and we’ll get back to you soon. 📩
        </p>
      </section>

      <div className="grid gap-8 md:grid-cols-[1.4fr,1fr] items-start">
        {/* Contact form */}
        <Card className="rounded-2xl shadow-soft">
          <CardHeader>
            <CardTitle>Send a Message</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Your full name" required />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+91-XXXXXXXXXX"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="Regarding valuation / project / feedback"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Write your message here..."
                  rows={4}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full mt-2"
                disabled={status === "submitting"}
              >
                {status === "submitting"
                  ? "Sending..."
                  : "Send Message"}
              </Button>

              {status === "success" && (
                <p className="text-xs text-emerald-600 mt-2">
                   Thank you! Your message has been recorded. We will get back to you soon.
                </p>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Contact details card */}
        <Card className="rounded-2xl bg-slate-900 text-slate-50">
          <CardHeader>
            <CardTitle>Contact Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 mt-0.5 text-blue-300" />
              <div>
                <p className="font-semibold">Address</p>
                <p className="text-slate-300">
                  Indore, Madhya Pradesh, India
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 mt-0.5 text-blue-300" />
              <div>
                <p className="font-semibold">Email</p>
                <p className="text-slate-300">
                  darpannaganpuriya@gmail.com
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 mt-0.5 text-blue-300" />
              <div>
                <p className="font-semibold">Phone</p>
                <p className="text-slate-300">+91-9111946697</p>
              </div>
            </div>

            <div className="pt-2">
              <p className="font-semibold mb-2">Social Links</p>
              <div className="flex flex-wrap gap-3 text-slate-200">
                <a
                  href="#"
                  className="inline-flex items-center gap-1 text-xs hover:text-blue-300"
                >
                  <Linkedin className="h-4 w-4" /> LinkedIn
                </a>
                <a
                  href="#"
                  className="inline-flex items-center gap-1 text-xs hover:text-blue-300"
                >
                  <Github className="h-4 w-4" /> GitHub
                </a>
                <a
                  href="#"
                  className="inline-flex items-center gap-1 text-xs hover:text-pink-300"
                >
                  <Instagram className="h-4 w-4" /> Instagram
                </a>
              </div>
            </div>

           
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
