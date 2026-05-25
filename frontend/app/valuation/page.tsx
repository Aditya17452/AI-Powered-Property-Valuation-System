"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";



type Amenities = {
  lift: boolean;
  parking: boolean;
  garden: boolean;
  security: boolean;
};

type FormState = {
  propertyType: string;
  location: string;
  bhk: string;
  areaSqft: string;
  age: string;
  facing: string;
  ownerType: string;
  amenities: Amenities;
};

type ValuationResult = {
  minPrice: number;
  maxPrice: number;
  avgPrice: number;
  psf: number;
  confidence: number;
};



const initialForm: FormState = {
  propertyType: "Apartment",
  location: "Vigyan Nagar, Indore",
  bhk: "2",
  areaSqft: "",
  age: "",
  facing: "East",
  ownerType: "Individual",
  amenities: {
    lift: false,
    parking: false,
    garden: false,
    security: false,
  },
};

export default function ValuationPage() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ValuationResult | null>(null);

  

  const handleAmenityChange = (key: keyof Amenities, value: boolean) => {
    setForm((prev) => ({
      ...prev,
      amenities: { ...prev.amenities, [key]: value },
    }));
  };

  const formatINR = (value: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.areaSqft) {
      alert("Please enter area in sqft.");
      return;
    }

    setLoading(true);
    setResult(null);

    const payload = {
      Locality: form.location,
      Property_Type: form.propertyType,
      Built_up_area_sqfeet: Number(form.areaSqft),
      Total_area_sqft: Number(form.areaSqft),
      BHK: Number(form.bhk),
      Age_of_Property: Number(form.age || 0),
      Registry_Rate_per_sqft: 4000,
      Owner_Type: form.ownerType,
    };

    try {
      const res = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("API error");

      const data = await res.json();

      setResult({
        minPrice: data.min_price,
        maxPrice: data.max_price,
        avgPrice: data.final_price,
        psf: data.rate_per_sqft,
        confidence: data.confidence,
      });
    } catch (error) {
      console.error(error);
      alert("Error while connecting to ML backend");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!result) {
      alert("No valuation available to download.");
      return;
    }

    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ unit: "mm", format: "a4" });
      const pageWidth = 210;
      const margin = 18;
      let y = 18;

      // Header bar
      doc.setFillColor(12, 85, 179);
      doc.rect(0, 0, pageWidth, 28, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(18);
      doc.text("Property Valuation Report", margin, 18);
      doc.setFontSize(10);
      doc.text(new Date().toLocaleString(), pageWidth - margin, 18, { align: "right" });

      y = 36;

      // Property details card
      doc.setDrawColor(220);
      doc.setFillColor(248, 249, 250);
      doc.rect(margin, y, pageWidth - margin * 2, 48, "F");
      doc.setTextColor(34, 34, 34);
      doc.setFontSize(12);
      doc.text("Property Details", margin + 2, y + 8);
      doc.setFontSize(10);

      const details = [
        ["Location", form.location],
        ["Property Type", form.propertyType],
        ["BHK", form.bhk],
        ["Area (sqft)", form.areaSqft || "-"],
        ["Age (years)", form.age || "0"],
        ["Owner Type", form.ownerType],
      ];

      let dy = y + 18;
      const labelX = margin + 4;
      const valueX = margin + 68;
      details.forEach(([label, value], i) => {
        doc.text(`${label}:`, labelX, dy + i * 6);
        doc.text(String(value), valueX, dy + i * 6);
      });

      y += 58;

      // Valuation summary card
      doc.setFillColor(255, 255, 255);
      doc.rect(margin, y, pageWidth - margin * 2, 58, "F");
      doc.setFontSize(12);
      doc.setTextColor(34, 34, 34);
      doc.text("Valuation Summary", margin + 2, y + 8);
      doc.setFontSize(11);
      doc.text(`Estimated Range: ${formatINR(result.minPrice)} – ${formatINR(result.maxPrice)}`, margin + 4, y + 24);
      doc.text(`Average Estimated Price: ${formatINR(result.avgPrice)}`, margin + 4, y + 34);
      doc.text(`Rate per sqft: ${formatINR(result.psf)} / sqft`, margin + 4, y + 44);
      doc.text(`Model Confidence: ${(result.confidence * 100).toFixed(0)}%`, pageWidth - margin - 40, y + 44);

      y += 74;

      // Notes / disclaimer
      doc.setFontSize(9);
      doc.setTextColor(110);
      const note = "This report provides an estimated valuation based on a machine learning model trained for Vigyan Nagar, Indore. It is for informational purposes only and not a formal appraisal.";
      doc.text(note, margin, y, { maxWidth: pageWidth - margin * 2 });

      // Footer
      doc.setFontSize(9);
      doc.setTextColor(140);
      doc.text("Generated by Property Valuation System", margin, 287);
      doc.text("www.example.com", pageWidth - margin, 287, { align: "right" });

      doc.save("valuation-report.pdf");
    } catch (err) {
      console.error("PDF generation failed", err);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-2 text-center">
        Property Valuation
      </h1>
      <p className="text-center text-gray-600 mb-8">
        Enter your property details to get an estimated valuation range for
        Vigyan Nagar, Indore.
      </p>

      <div className="grid gap-8 md:grid-cols-[1.5fr,1fr] items-start">
        {/* LEFT FORM */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Property Details</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Property Type */}
            <div className="space-y-1">
              <Label>Property Type</Label>
              <Select
                value={form.propertyType}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, propertyType: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Apartment">Apartment</SelectItem>
                  <SelectItem value="Independent House">
                    Independent House
                  </SelectItem>
                  <SelectItem value="Plot">Plot</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Owner Type */}
            <div className="space-y-1">
              <Label>Owner Type</Label>
              <Select
                value={form.ownerType}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, ownerType: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Owner">Owner</SelectItem>
                  <SelectItem value="Dealer">Dealer</SelectItem>
                  <SelectItem value="Individual">Individual</SelectItem>
                  <SelectItem value="Joint">Joint</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Location */}
            <div className="space-y-1">
              <Label>Location</Label>
              <Input value={form.location} disabled />
            </div>

            {/* BHK & Area */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <Label>BHK</Label>
                <Select
                  value={form.bhk}
                  onValueChange={(value) =>
                    setForm((prev) => ({ ...prev, bhk: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 BHK</SelectItem>
                    <SelectItem value="2">2 BHK</SelectItem>
                    <SelectItem value="3">3 BHK</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label>Area (sqft)</Label>
                <Input
                  type="number"
                  value={form.areaSqft}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      areaSqft: e.target.value,
                    }))
                  }
                  required
                />
              </div>
            </div>

            {/* Age */}
            <div className="space-y-1">
              <Label>Property Age (years)</Label>
              <Input
                type="number"
                value={form.age}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, age: e.target.value }))
                }
              />
            </div>

            {/* Amenities */}
            <div className="space-y-2">
              <Label>Amenities</Label>
              <div className="grid grid-cols-2 gap-2">
                {["lift", "parking", "garden", "security"].map((key) => (
                  <label key={key} className="flex items-center gap-2 text-sm">
                    <Checkbox
                      checked={form.amenities[key as keyof Amenities]}
                      onCheckedChange={(checked) =>
                        handleAmenityChange(
                          key as keyof Amenities,
                          Boolean(checked)
                        )
                      }
                    />
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </label>
                ))}
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Calculating valuation...
                </span>
              ) : (
                "Get Valuation"
              )}
            </Button>
          </form>
        </Card>

        {/* RIGHT RESULT */}
        <Card className="p-6 sticky top-24">
          <h2 className="text-xl font-semibold mb-4">
            Estimated Property Valuation
          </h2>

          {loading ? (
            <div className="flex flex-col items-center py-10 text-sm text-gray-500">
              <Loader2 className="h-8 w-8 animate-spin mb-3" />
              Calculating valuation using ML model...
            </div>
          ) : !result ? (
            <p className="text-gray-500 text-sm">
              Fill the details and click <b>Get Valuation</b>.
            </p>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Estimated Range</p>
                <p className="text-2xl font-bold">
                  {formatINR(result.minPrice)} –{" "}
                  {formatINR(result.maxPrice)}
                </p>
              </div>

              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span>Average Estimated Price</span>
                  <span>{formatINR(result.avgPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Rate per sqft</span>
                  <span>{formatINR(result.psf)} / sqft</span>
                </div>
                <div className="flex justify-between">
                  <span>Model Confidence</span>
                  <span>{(result.confidence * 100).toFixed(0)}%</span>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={handleDownloadPdf}
              >
                Download Valuation Report (PDF)
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
