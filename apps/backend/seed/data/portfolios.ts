import { UserPortfolioModel } from "../../src/domains/career/user-portfolio/infrastructure/persistence/UserPortfolioModel.js";
import { PortfolioProjectModel } from "../../src/domains/career/portfolio/infrastructure/persistence/PortfolioProjectModel.js";

import { pick, pickMany, chance, randomInt } from "../utils/random.js";
import type { SeededStudent } from "../types.js";

const HEADLINES = [
  "Aspiring Software Engineer | CS Student",
  "Full-Stack Developer in the making",
  "Data enthusiast, always building something",
  "Frontend-focused, learning backend every day",
  "CS student exploring ML and web dev",
];

const SUMMARIES = [
  "Third-year CS student who enjoys building real, working things more than reading about them. Comfortable across the stack, still figuring out what I want to specialize in.",
  "I like turning half-formed ideas into working prototypes. Currently deep in web development, picking up systems design on the side.",
  "Building projects to learn, not just to have something to show. Interested in backend architecture and developer tooling.",
  "Started with web dev, got pulled into data and ML along the way. Still writing a lot of JavaScript though.",
];

const PROJECT_TEMPLATES: { title: string; description: string; techStack: string[] }[] = [
  { title: "Campus Event Tracker", description: "A small web app for tracking and RSVPing to campus events, built to replace a shared spreadsheet.", techStack: ["React", "Node.js", "MongoDB"] },
  { title: "Expense Splitter", description: "A group expense-splitting tool with real-time balance calculation - started as a way to stop doing the math manually with roommates.", techStack: ["React", "Express", "PostgreSQL"] },
  { title: "Study Group Matcher", description: "Matches students into study groups based on course overlap and availability - built during a hackathon, kept improving it after.", techStack: ["Next.js", "TypeScript", "Prisma"] },
  { title: "Personal Finance Dashboard", description: "A dashboard for tracking spending across categories, with basic charts - my first real project with a database.", techStack: ["Python", "Flask", "SQLite"] },
  { title: "Movie Recommendation Engine", description: "A content-based recommendation system built on a public movie dataset - my introduction to actual ML instead of just tutorials.", techStack: ["Python", "scikit-learn", "Pandas"] },
  { title: "Portfolio CMS", description: "A lightweight CMS I built for my own portfolio site so I could stop hardcoding project data.", techStack: ["Next.js", "TypeScript", "Tailwind CSS"] },
];

/**
 * Real portfolios for student accounts - a UserPortfolio (headline,
 * summary, real-looking social links) plus 2-3 real
 * PortfolioProject entries per student, matching the exact fields
 * both real models actually have. Not every student gets one
 * (matching realistic variation, same pattern as submissions), but
 * the demo-designated student (student1@<code>.edu) is guaranteed a
 * real, complete portfolio.
 */
export async function seedPortfolios(students: SeededStudent[]): Promise<void> {
  let portfoliosCreated = 0;
  let projectsCreated = 0;

  for (const student of students) {
    const isDemoStudent = student.email.startsWith("student1@");
    if (!isDemoStudent && !chance(0.7)) continue;

    const usernameSlug = student.email.split("@")[0];

    await UserPortfolioModel.create({
      userId: student.userId,
      headline: pick(HEADLINES),
      summary: pick(SUMMARIES),
      github: `https://github.com/${usernameSlug}`,
      linkedin: `https://linkedin.com/in/${usernameSlug}`,
      visibility: "PUBLIC",
    });
    portfoliosCreated++;

    const projects = pickMany(PROJECT_TEMPLATES, isDemoStudent ? 3 : randomInt(1, 2));

    for (let i = 0; i < projects.length; i++) {
      const project = projects[i];
      await PortfolioProjectModel.create({
        userId: student.userId,
        title: project.title,
        description: project.description,
        techStack: project.techStack,
        github: `https://github.com/${usernameSlug}/${project.title.toLowerCase().replace(/\s+/g, "-")}`,
        featured: i === 0,
      });
      projectsCreated++;
    }
  }

  console.log(`Seed: created ${portfoliosCreated} portfolios with ${projectsCreated} projects`);
}
