import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-12 border-t bg-white">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-10 grid gap-8 md:grid-cols-3">
        {/* Brand + tagline */}
        <div className="space-y-2">
          <h3 className="text-lg font-bold">Property Valuation System</h3>
          <p className="text-sm text-slate-600">
            A free, ML-powered project to make property valuation more
            transparent for buyers and sellers in Vigyan Nagar, Indore.
          </p>
        </div>

        {/* Contact info */}
        <div className="space-y-2 text-sm text-slate-700">
          <h4 className="font-semibold mb-1">Contact</h4>
          <p>
            📍 <span className="text-slate-600">
              Indore, Madhya Pradesh
            </span>
          </p>
          <p>
            📧 <a href="mailto:contact@propertyvaluation.in" className="hover:underline">
              darpannaganpuriya@gmail.com
            </a>
          </p>
          <p>
            📞 <a href="tel:+919111946697" className="hover:underline">
              +91-91119-46697
            </a>
          </p>
         
        </div>

        {/* Socials */}
        <div className="space-y-2 text-sm text-slate-700">
          <h4 className="font-semibold mb-1">Connect</h4>
          <div className="flex flex-col gap-1">
            <Link
              href="https://www.linkedin.com/in/darpan-naganpuriya-464b102a7/"
              className="hover:underline inline-flex items-center gap-2"
            >
              🔗 LinkedIn
            </Link>
            <Link
              href="https://github.com/darpannaganpuriya"
              className="hover:underline inline-flex items-center gap-2"
            >
              💻 GitHub
            </Link>
            <Link
              href="#"
              className="hover:underline inline-flex items-center gap-2"
            >
              📸 Instagram
            </Link>
            <Link
              href="#"
              className="hover:underline inline-flex items-center gap-2"
            >
              🌐 Portfolio / Website
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <span>
            © {new Date().getFullYear()} Property Valuation System. All rights reserved.
          </span>
          <span>Built with ❤️ using Next.js, Tailwind &amp; shadcn/ui.</span>
        </div>
      </div>
    </footer>
  );
}
