import { Link } from "react-router-dom";

import { Button } from "@/shared/ui/Button";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "AI", href: "#ai" },
  { label: "Career", href: "#career" },
  { label: "Placements", href: "#placements" },
  { label: "FAQ", href: "#faq" },
];

export function Header() {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-border/50 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="font-display text-xl font-bold tracking-wide text-foreground">
          RyuZen
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="font-body text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Button variant="ghost" asChild>
            <Link to="/auth/login">Login</Link>
          </Button>

          <Button asChild>
            <Link to="/auth/register">Join Organization</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
