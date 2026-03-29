import { Phone } from "lucide-react";

export function Header() {
  return (
    <header className="fc-header-bg sticky top-0 z-50 w-full">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2" data-ocid="header.link">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "oklch(0.55 0.200 262)" }}
          >
            <Phone className="w-4 h-4 text-white" />
          </div>
          <span
            className="text-lg font-bold tracking-tight"
            style={{ color: "oklch(0.96 0.008 220)" }}
          >
            FakeCall
          </span>
        </div>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {["Features", "How it Works", "App", "Blog"].map((item) => (
            <a
              key={item}
              href="#features"
              className="text-sm font-medium transition-colors"
              style={{ color: "oklch(0.73 0.025 220)" }}
              data-ocid="header.link"
            >
              {item}
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <a
            href="#app"
            className="hidden md:inline text-sm font-medium"
            style={{ color: "oklch(0.73 0.025 220)" }}
            data-ocid="header.link"
          >
            Log In
          </a>
          <button
            type="button"
            className="fc-btn-primary text-sm font-semibold px-4 py-2 rounded-xl"
            data-ocid="header.primary_button"
          >
            Get Started
          </button>
        </div>
      </div>
    </header>
  );
}
