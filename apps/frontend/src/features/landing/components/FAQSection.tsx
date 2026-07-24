import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/shared/ui/Accordion";
import { LandingSection } from "@/features/landing/components/LandingSection";
import { ScrollReveal } from "@/shared/components/ScrollReveal";

const FAQS = [
  {
    question: "Who is RyuZen built for?",
    answer:
      "RyuZen is built for entire campuses — students, faculty, alumni, and organization administrators all use the same platform, with permissions and dashboards tailored to each role.",
  },
  {
    question: "How does the XP and leaderboard system work?",
    answer:
      "Points are earned automatically from real activity — approved activity submissions, event attendance, club involvement, and placement outcomes. Nothing is self-reported into the score.",
  },
  {
    question: "Are achievements and badges verified?",
    answer:
      "Yes. Achievements are submitted by students and confirmed by faculty or administrators before they count toward your profile or Career Score — self-reported claims alone don't count.",
  },
  {
    question: "Can our organization use our own branding?",
    answer:
      "RyuZen is built so an organization's branding, logo, and theme can be customized without touching any of the underlying features every organization shares.",
  },
  {
    question: "Is my organization's data isolated from others?",
    answer: "Yes — every organization's data is fully scoped and separated at the platform level.",
  },
];

export function FAQSection() {
  return (
    <LandingSection id="faq" eyebrow="Questions" title="Frequently asked questions">
      <div className="mx-auto max-w-2xl">
        <ScrollReveal>
          <Accordion type="single" collapsible>
            {FAQS.map((faq, i) => (
              <AccordionItem key={faq.question} value={`item-${i}`}>
                <AccordionTrigger className="text-left font-display text-base">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="font-body text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </ScrollReveal>
      </div>
    </LandingSection>
  );
}
