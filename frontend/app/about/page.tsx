import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto py-12 px-4 md:px-6 space-y-8">
      <section className="text-center space-y-3">
        <h1 className="text-3xl font-bold">About Property Valuation System</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Property Valuation System is a free, ML-powered web application that
          helps users estimate the fair market value of their residential
          properties in Vigyan Nagar, Indore.
        </p>
      </section>

      {/* Project Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Project Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-gray-700">
          <p>
            This project focuses on providing <b>free, transparent</b> property
            valuation without charging any commission or fees. Users can enter
            details such as property type, BHK, area in sqft, age, facing and
            amenities to get an estimated price range.
          </p>
          <p>
            The core idea is to help common buyers and sellers in localities
            like Vigyan Nagar, Indore, where professional valuation services are
            either paid or not easily accessible.
          </p>
        </CardContent>
      </Card>

      {/* Tech Stack */}
      <Card>
        <CardHeader>
          <CardTitle>Technology Stack</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 text-sm">
          <div>
            <h3 className="font-semibold mb-1">Frontend</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li>Next.js (App Router) + React</li>
              <li>TypeScript</li>
              <li>Tailwind CSS</li>
              <li>shadcn/ui components</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-1">Backend & ML (Planned)</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li>Python (Flask / FastAPI)</li>
              <li>Regression-based ML model</li>
              <li>Dataset of ~150 real + synthetic records</li>
              <li>API endpoints for valuation & PDF report</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Future Scope */}
      <Card>
        <CardHeader>
          <CardTitle>Future Scope</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-sm text-gray-700">
          <ul className="list-disc list-inside space-y-1">
            <li>Support for more localities beyond Vigyan Nagar.</li>
            <li>Real-time integration with property listing platforms.</li>
            <li>Visualizations like price trends and heat maps.</li>
            <li>Loan eligibility and rent estimation tools.</li>
            <li>Downloadable valuation report in PDF format.</li>
          </ul>
        </CardContent>
      </Card>

      {/* Team section – placeholder for viva / report */}
      <Card>
        <CardHeader>
          <CardTitle>Project Team</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3 text-sm text-gray-700">
          <div>
            <p className="font-semibold">Darpan Naganpuriya</p>
            
          </div>
          <div>
            <p className="font-semibold">Aditya Chouksey</p>
            
          </div>
          <div>
            <p className="font-semibold">Yash Joshi</p>
            
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
