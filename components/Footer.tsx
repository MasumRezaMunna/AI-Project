import Link from "next/link";

const CATEGORIES = ["Adventure", "Culinary", "Cultural", "Wildlife"];

export default function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-forest-700 text-paper dark:border-ink-dark/10">
      <div className="mx-auto grid max-w-content grid-cols-1 gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="flex items-center gap-2 font-display text-lg font-semibold">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-mustard-300">
              <path d="M3 18c3-1 4-7 7-9s5 6 8 4M3 6l3 1M21 18l-3-1" strokeLinecap="round" />
            </svg>
            Wanderlust Trails
          </p>
          <p className="mt-3 max-w-xs text-sm text-paper/70">
            Small-group, locally-guided travel experiences across 12 countries, picked for what happens off the standard itinerary.
          </p>
        </div>

        <div>
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-paper/50">Explore</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link href="/" className="hover:text-mustard-300">Home</Link></li>
            <li><Link href="/explore" className="hover:text-mustard-300">All experiences</Link></li>
            <li><Link href="/explore#concierge" className="hover:text-mustard-300">AI Trip Concierge</Link></li>
          </ul>
        </div>

        <div>
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-paper/50">Categories</p>
          <ul className="mt-4 space-y-2 text-sm">
            {CATEGORIES.map((cat) => (
              <li key={cat}>
                <Link href={`/explore?category=${encodeURIComponent(cat)}`} className="hover:text-mustard-300">
                  {cat}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-paper/50">Contact</p>
          <ul className="mt-4 space-y-2 text-sm text-paper/80">
            <li>
              <a href="mailto:hello@wanderlusttrails.example" className="hover:text-mustard-300">
                hello@wanderlusttrails.com
              </a>
            </li>
            <li>
              <a href="tel:+18005551234" className="hover:text-mustard-300">
                +121 555-1234
              </a>
            </li>
          </ul>
          <div className="mt-4 flex gap-3">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-paper/20 hover:border-mustard-300 hover:text-mustard-300"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </svg>
            </a>
            <a
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X (formerly Twitter)"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-paper/20 hover:border-mustard-300 hover:text-mustard-300"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4l16 16M20 4 4 20" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-paper/10 px-6 py-5 text-center text-xs text-paper/50">
        © {new Date().getFullYear()} Wanderlust Trails. A demo project — sample data, no real bookings.
      </div>
    </footer>
  );
}
