import { Link } from "react-router-dom";

const PRODUCT_LINKS = [
  { label: "Features", href: "#features" },
  { label: "AI", href: "#ai" },
  { label: "Career", href: "#career" },
  { label: "Placements", href: "#placements" },
];

const COMPANY_LINKS = [
  { label: "Organizations", href: "#organizations" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-card/30">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div className="col-span-2">
            <Link to="/" className="font-display text-lg font-bold tracking-wide text-foreground">
              RyuZen
            </Link>
            <p className="mt-2 max-w-xs font-body text-sm text-muted-foreground">
              The AI-powered campus operating system — one platform, every role.
            </p>
          </div>

          <div>
            <h4 className="mb-3 font-body text-xs font-semibold uppercase tracking-wide text-foreground">
              Product
            </h4>
            <ul className="flex flex-col gap-2">
              {PRODUCT_LINKS.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="font-body text-sm text-muted-foreground hover:text-primary">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-3 font-body text-xs font-semibold uppercase tracking-wide text-foreground">
              Company
            </h4>
            <ul className="flex flex-col gap-2">
              {COMPANY_LINKS.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="font-body text-sm text-muted-foreground hover:text-primary">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-border/60 pt-6 text-center font-body text-sm text-muted-foreground">
          © {new Date().getFullYear()} RyuZen. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
