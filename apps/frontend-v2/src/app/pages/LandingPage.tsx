import { Link, Navigate } from "react-router-dom";
import {
  ArrowRight,
  Briefcase,
  TrendingUp,
  Users,
  MessageCircle,
  Sparkles,
  Building2,
  ShieldCheck,
  Award,
} from "lucide-react";

import { Button } from "@/shared/ui/Button";
import { useAuth } from "@/domains/auth/AuthContext";
import { getPortalPathForRole } from "@/app/router/getPortalPathForRole";

const FEATURES = [
  { icon: Briefcase, title: "Placement drives", desc: "Real drives, real applications, real interview scheduling - end to end, not a static job board." },
  { icon: TrendingUp, title: "Career score", desc: "One honest number combining activity, resume strength, and verified achievements." },
  { icon: Sparkles, title: "AI assistant", desc: "Resume feedback and career guidance, backed by a real AI provider your institution controls." },
  { icon: Users, title: "Campus network", desc: "Students, faculty, and alumni connect and message in one place, not three." },
  { icon: ShieldCheck, title: "Built-in isolation", desc: "Every department, batch, and organization boundary is enforced server-side, not assumed." },
  { icon: Award, title: "Verified achievements", desc: "Certificates and accomplishments carry real faculty verification, not self-reported claims." },
];

const AUDIENCES = [
  { icon: Building2, label: "For institutions", desc: "Run placements, manage faculty and students, and see real activity - not a demo dashboard." },
  { icon: Briefcase, label: "For recruiters", desc: "Reach real, eligible candidates and manage your own hiring pipeline end to end." },
  { icon: Users, label: "For students & alumni", desc: "Track your growth, apply to drives, and stay connected to your campus network." },
];

export function LandingPage() {
  const { user, isLoading } = useAuth();

  if (!isLoading && user) {
    return <Navigate to={getPortalPathForRole(user.role)} replace />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="text-lg font-semibold">RyuZen</span>
          <nav className="flex items-center gap-3">
            <Button asChild variant="ghost" size="sm">
              <Link to="/login">Sign in</Link>
            </Button>
          </nav>
        </div>
      </header>

      <section className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-6 pb-20 pt-24 text-center">
        <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          One platform, every stage of campus growth
        </span>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Placements, growth, and community — <span className="text-primary">in one real platform</span>
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          RyuZen connects students, faculty, recruiters, and institutions with genuine placement
          pipelines, verified achievements, and an honest career score — not another dashboard
          template.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg" className="flex items-center gap-2">
            <Link to="/login">
              Get started
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <a href="#features">See what's inside</a>
          </Button>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-6xl px-6 pb-20">
        <h2 className="mb-10 text-center text-2xl font-semibold">Everything your campus actually needs</h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="rounded-xl border border-border bg-card p-6">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <f.icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="mb-1.5 font-semibold">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-card/40 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-10 text-center text-2xl font-semibold">Built for every role on campus</h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {AUDIENCES.map((a) => (
              <div key={a.label} className="flex flex-col items-center gap-3 rounded-xl border border-border p-8 text-center">
                <a.icon className="h-7 w-7 text-primary" aria-hidden="true" />
                <h3 className="font-semibold">{a.label}</h3>
                <p className="text-sm text-muted-foreground">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-6 py-24 text-center">
        <MessageCircle className="h-8 w-8 text-primary" aria-hidden="true" />
        <h2 className="text-2xl font-semibold">Ready to bring your campus onto RyuZen?</h2>
        <p className="text-muted-foreground">Sign in to get started, or reach out to bring your institution on board.</p>
        <Button asChild size="lg" className="flex items-center gap-2">
          <Link to="/login">
            Sign in
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </Button>
      </section>

      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} RyuZen. All rights reserved.
      </footer>
    </div>
  );
}
