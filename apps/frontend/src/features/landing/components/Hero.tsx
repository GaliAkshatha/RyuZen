import { Link } from "react-router-dom";

import { Button } from "@/shared/ui/Button";

export function Hero() {
  return (
    <section className="flex min-h-screen items-center justify-center px-6">
      <div className="mx-auto max-w-3xl text-center">

        <p className="mb-4 text-sm uppercase tracking-[0.4em] text-primary">
          Welcome To
        </p>

        <h1 className="mb-6 text-6xl font-black tracking-tight text-foreground">
          RYUZEN
        </h1>

        <p className="mb-4 text-2xl font-semibold text-foreground">
          AI Powered Campus Operating System
        </p>

        <p className="mx-auto mb-10 max-w-xl text-muted-foreground">
          Transforming Learning.
          <br />
          Building Careers.
        </p>

        <div className="flex justify-center gap-4">

          <Button size="lg" asChild>
            <Link to="/auth/register">
              Get Started
            </Link>
          </Button>

          <Button variant="outline" size="lg" asChild>
            <Link to="/auth/login">
              Login
            </Link>
          </Button>

        </div>

      </div>
    </section>
  );
}