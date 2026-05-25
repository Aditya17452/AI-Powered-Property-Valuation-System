import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <header className="w-full border-b">
      <nav className="max-w-6xl mx-auto flex items-center justify-between py-4 px-6">
        <h1 className="text-xl font-bold">Property Valuation System</h1>
        <div className="flex gap-4 items-center">
          <Link href="/">Home</Link>
          <Link href="/valuation">Valuation</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
        </div>
        <Button asChild>
          <Link href="/valuation">Get Started</Link>
        </Button>
      </nav>
    </header>
  );
}
