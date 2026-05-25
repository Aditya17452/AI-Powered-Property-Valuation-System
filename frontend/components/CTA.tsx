import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CTA() {
  return (
    <section className="py-16 bg-gray-50 text-center">
      <h2 className="text-2xl font-bold mb-4">
        Know the True Market Value of Your Property
      </h2>
      <p className="mb-6 text-gray-600">
        100% free valuation powered by machine learning and real estate insights.
      </p>
      <Button asChild>
        <Link href="/valuation">Get Free Valuation</Link>
      </Button>
    </section>
  );
}
