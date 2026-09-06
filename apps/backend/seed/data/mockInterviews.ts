import { MockInterviewSessionModel } from "../../src/domains/ai/interview/infrastructure/persistence/MockInterviewSessionModel.js";

import { pickMany, randomInt } from "../utils/random.js";
import type { SeededOrganization, SeededStudent } from "../types.js";

const ROLES = ["Software Engineer", "Backend Developer", "Data Analyst"];

const SAMPLE_EXCHANGES: { question: string; answer: string; difficulty: "EASY" | "MEDIUM" | "HARD"; qualityScore: number }[] = [
  {
    question: "Tell me about a project you're proud of and your specific role in it.",
    answer:
      "I built a real-time chat app using React and WebSockets. I designed the message queue and handled reconnection logic when the connection dropped.",
    difficulty: "EASY",
    qualityScore: 78,
  },
  {
    question: "How would you design a rate limiter for a public API?",
    answer:
      "I'd use a token bucket algorithm - each client gets a bucket of tokens that refill over time, and each request consumes one token. Redis works well for tracking this across multiple servers.",
    difficulty: "MEDIUM",
    qualityScore: 85,
  },
  {
    question: "What's the difference between SQL and NoSQL databases, and when would you choose one over the other?",
    answer:
      "SQL databases enforce a fixed schema and support joins, good for structured relational data. NoSQL is more flexible and scales horizontally better for unstructured or high-volume data.",
    difficulty: "MEDIUM",
    qualityScore: 72,
  },
  {
    question: "Walk me through how you'd debug a production API that suddenly started returning 500 errors.",
    answer: "I'd check the logs first.",
    difficulty: "HARD",
    qualityScore: 35,
  },
  {
    question: "How do you handle disagreement with a teammate about a technical approach?",
    answer:
      "I try to understand their reasoning first, then explain mine with concrete tradeoffs - performance, maintainability, time. If we can't agree, I'm fine deferring to whoever has more context on that part of the system.",
    difficulty: "MEDIUM",
    qualityScore: 80,
  },
];

/**
 * Real completed interview sessions with a genuine transcript - not
 * placeholder text. Score is computed the same way the real feature
 * computes it (average of per-question quality scores, since every
 * sample answer here clears the real length gate), so the seeded
 * data is internally consistent with what a real session would
 * produce, not an arbitrary number bolted on separately.
 */
export async function seedMockInterviews(org: SeededOrganization, students: SeededStudent[]): Promise<void> {
  const demoStudent = students.find((s) => s.email.startsWith("student1@"));
  const otherStudents = pickMany(
    students.filter((s) => s.email !== demoStudent?.email),
    Math.min(2, students.length - 1),
  );

  const participants = demoStudent ? [demoStudent, ...otherStudents] : otherStudents;

  for (const student of participants) {
    const role = ROLES[randomInt(0, ROLES.length - 1)];
    const exchangeCount = randomInt(3, 5);
    const selected = SAMPLE_EXCHANGES.slice(0, exchangeCount);

    const now = Date.now();
    const startedDaysAgo = randomInt(2, 40);
    let cursor = now - startedDaysAgo * 24 * 60 * 60 * 1000;

    const exchanges = selected.map((ex) => {
      const askedAt = new Date(cursor);
      cursor += randomInt(60, 180) * 1000;
      const answeredAt = new Date(cursor);
      cursor += randomInt(10, 30) * 1000;

      return {
        question: ex.question,
        difficulty: ex.difficulty,
        answer: ex.answer,
        qualityScore: ex.qualityScore,
        askedAt,
        answeredAt,
      };
    });

    const score = Math.round(exchanges.reduce((sum, ex) => sum + ex.qualityScore, 0) / exchanges.length);

    const strengths: string[] = [];
    const improvements: string[] = [];
    for (const ex of exchanges) {
      if (ex.qualityScore >= 75) {
        strengths.push(`Gave a clear, well-reasoned answer on "${ex.question.slice(0, 50)}..."`);
      } else if (ex.qualityScore < 50) {
        improvements.push(`The answer to "${ex.question.slice(0, 50)}..." was too brief - walk through your reasoning, not just a conclusion.`);
      }
    }
    if (strengths.length === 0) {
      strengths.push("Communicated answers clearly and stayed on topic throughout.");
    }
    if (improvements.length === 0) {
      improvements.push("Consider giving more concrete examples from real projects to back up general statements.");
    }

    await MockInterviewSessionModel.create({
      userId: student.userId,
      role,
      exchanges,
      status: "COMPLETED",
      durationMinutes: 20,
      feedback: `Overall a ${score >= 70 ? "strong" : score >= 50 ? "solid" : "developing"} interview performance for the ${role} role, with a score of ${score}/100.`,
      strengths,
      improvements,
      score,
      createdAt: new Date(now - startedDaysAgo * 24 * 60 * 60 * 1000),
    });
  }
}
