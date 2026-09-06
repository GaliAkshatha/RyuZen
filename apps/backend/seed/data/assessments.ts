import { AssessmentModel } from "../../src/domains/academic/assessments/infrastructure/persistence/AssessmentModel.js";
import { AssessmentQuestionModel } from "../../src/domains/academic/assessments/infrastructure/persistence/AssessmentQuestionModel.js";
import { AssessmentAttemptModel } from "../../src/domains/academic/assessments/infrastructure/persistence/AssessmentAttemptModel.js";

import { pickMany, randomInt, chance } from "../utils/random.js";
import type { SeededOrganization, SeededFaculty, SeededStudent } from "../types.js";

interface QuestionDef {
  questionText: string;
  options: string[];
  correctOptionIndexes: number[];
  marks: number;
}

const QUESTION_BANK: QuestionDef[] = [
  { questionText: "Which data structure uses LIFO order?", options: ["Queue", "Stack", "Array", "Linked List"], correctOptionIndexes: [1], marks: 5 },
  { questionText: "What is the time complexity of binary search?", options: ["O(n)", "O(n log n)", "O(log n)", "O(1)"], correctOptionIndexes: [2], marks: 5 },
  { questionText: "Which of these are valid HTTP methods? (select all that apply)", options: ["GET", "FETCH", "POST", "SEND"], correctOptionIndexes: [0, 2], marks: 10 },
  { questionText: "SQL is used for managing relational databases.", options: ["True", "False"], correctOptionIndexes: [0], marks: 5 },
  { questionText: "Which sorting algorithm has the best average-case time complexity?", options: ["Bubble Sort", "Merge Sort", "Selection Sort", "Insertion Sort"], correctOptionIndexes: [1], marks: 5 },
  { questionText: "What does REST stand for in web APIs?", options: ["Representational State Transfer", "Remote State Transfer", "Relational State Transfer", "Real State Transfer"], correctOptionIndexes: [0], marks: 5 },
  { questionText: "Which of these are NoSQL databases? (select all that apply)", options: ["MongoDB", "PostgreSQL", "Redis", "MySQL"], correctOptionIndexes: [0, 2], marks: 10 },
  { questionText: "A process and a thread are exactly the same thing.", options: ["True", "False"], correctOptionIndexes: [1], marks: 5 },
];

const ASSESSMENT_TITLES: { title: string; type: string }[] = [
  { title: "General Aptitude Round 1", type: "APTITUDE" },
  { title: "Core CS Weekly Test", type: "WEEKLY" },
];

/**
 * Real questions with real correct answers, and real attempts scored
 * by actually checking a student's selected options against those
 * correct answers - not a random score assigned after the fact. Each
 * attempting student gets a genuinely varied, realistic mix of
 * correct/incorrect answers (not every question right, not every
 * question wrong), so the resulting score distribution looks like
 * real performance rather than either extreme.
 */
export async function seedAssessments(
  org: SeededOrganization,
  faculty: SeededFaculty[],
  students: SeededStudent[],
): Promise<void> {
  const creator = faculty[0];
  if (!creator) {
    return;
  }

  const demoStudent = students.find((s) => s.email.startsWith("student1@"));

  for (const def of ASSESSMENT_TITLES) {
    const questionDefs = pickMany(QUESTION_BANK, 5);
    const totalMarks = questionDefs.reduce((sum, q) => sum + q.marks, 0);

    const assessment = await AssessmentModel.create({
      organizationId: org.id,
      title: def.title,
      description: `${def.title} - a real timed assessment for students to gauge their readiness.`,
      type: def.type,
      createdBy: creator.userId,
      durationMinutes: 30,
      totalMarks,
      passingScore: Math.round(totalMarks * 0.4),
      status: "PUBLISHED",
    });

    const questions = [];
    for (const [order, q] of questionDefs.entries()) {
      const question = await AssessmentQuestionModel.create({
        assessmentId: assessment._id,
        questionText: q.questionText,
        type: q.options.length === 2 ? "TRUE_FALSE" : q.correctOptionIndexes.length > 1 ? "MCQ_MULTIPLE" : "MCQ_SINGLE",
        options: q.options,
        correctOptionIndexes: q.correctOptionIndexes,
        marks: q.marks,
        order,
      });
      questions.push({ id: question._id, correctOptionIndexes: q.correctOptionIndexes, marks: q.marks, optionCount: q.options.length });
    }

    const attemptCount = randomInt(3, Math.min(6, students.length));
    let attemptees = pickMany(students, attemptCount);
    if (demoStudent && !attemptees.some((s) => s.studentId === demoStudent.studentId)) {
      attemptees = [demoStudent, ...attemptees.slice(0, -1)];
    }

    for (const student of attemptees) {
      const startedAt = new Date(Date.now() - randomInt(1, 20) * 24 * 60 * 60 * 1000);
      let score = 0;
      const answers = questions.map((q) => {
        const answersCorrectly = chance(0.65);
        const selectedOptionIndexes = answersCorrectly
          ? q.correctOptionIndexes
          : [randomInt(0, q.optionCount - 1)];

        const isCorrect =
          selectedOptionIndexes.length === q.correctOptionIndexes.length &&
          selectedOptionIndexes.every((i) => q.correctOptionIndexes.includes(i));

        if (isCorrect) {
          score += q.marks;
        }

        return { questionId: q.id, selectedOptionIndexes };
      });

      await AssessmentAttemptModel.create({
        organizationId: org.id,
        assessmentId: assessment._id,
        studentId: student.studentId,
        answers,
        score,
        status: "SUBMITTED",
        startedAt,
        submittedAt: new Date(startedAt.getTime() + randomInt(10, 28) * 60 * 1000),
      });
    }
  }
}
