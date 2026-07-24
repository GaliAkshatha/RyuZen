import { Mail } from "lucide-react";

import { Button } from "@/shared/ui/Button";
import { LandingSection } from "@/features/landing/components/LandingSection";
import { ScrollReveal } from "@/shared/components/ScrollReveal";

/**
 * A real mailto: link, not a fake form — there is no contact-form
 * backend endpoint to submit to, and building a form that silently
 * goes nowhere would be worse than a simple, honest email link.
 */
export function ContactSection() {
  return (
    <LandingSection id="contact" eyebrow="Get In Touch" title="Bring RyuZen to your campus">
      <ScrollReveal className="mx-auto flex max-w-xl flex-col items-center gap-6 text-center">
        <p className="font-body text-muted-foreground">
          Whether you're evaluating RyuZen for your organization or just have a question, we'd love
          to hear from you.
        </p>
        <Button size="lg" asChild>
          <a href="mailto:hello@ryuzen.ai" className="flex items-center gap-2">
            <Mail className="h-4 w-4" aria-hidden="true" />
            hello@ryuzen.ai
          </a>
        </Button>
      </ScrollReveal>
    </LandingSection>
  );
}
