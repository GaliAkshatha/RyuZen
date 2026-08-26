import { NewsModel } from "../../src/domains/communication/news/infrastructure/persistence/NewsModel.js";
import { UserRole } from "../../src/domains/identity/domain/constants/UserRole.js";

import { pick } from "../utils/random.js";
import type { SeededOrganization, SeededFaculty } from "../types.js";

/**
 * Real campus news posts, authored by the exact three roles
 * CreateNewsUseCase actually allows (Faculty, Org Admin, Placement
 * Admin) - matches that real restriction rather than inventing
 * content from a role that could never post it for real. Author
 * name/role are taken directly from the real seeded accounts passed
 * in, the same denormalization CreateNewsUseCase itself performs at
 * creation time.
 */
export async function seedNews(
  org: SeededOrganization,
  faculty: SeededFaculty[],
  placementAdmin: { id: string; name: string },
): Promise<void> {
  const facultyAuthor = faculty.length > 0 ? pick(faculty) : null;

  const posts: { authorId: string; authorName: string; authorRole: string; title: string; content: string }[] = [
    {
      authorId: org.orgAdmin.id,
      authorName: org.orgAdmin.name,
      authorRole: UserRole.ORG_ADMIN,
      title: "Welcome to the new semester",
      content: `Welcome back to ${org.name}! Check the Activities tab for what's open this term, and keep an eye here for updates from your department and the placement cell throughout the semester.`,
    },
    {
      authorId: placementAdmin.id,
      authorName: placementAdmin.name,
      authorRole: UserRole.PLACEMENT_ADMIN,
      title: "New placement drives now open",
      content: "Several companies have opened new drives for this term. Head to the Drives tab to check eligibility and apply before the deadlines close - some are filling up quickly.",
    },
  ];

  if (facultyAuthor) {
    posts.push({
      authorId: facultyAuthor.userId,
      authorName: facultyAuthor.name,
      authorRole: UserRole.FACULTY,
      title: "Assignment deadline reminder",
      content: "A reminder that several open activities are due soon. Submit early if you can - reviews take a few days, and late submissions may not be accepted.",
    });
  }

  for (const post of posts) {
    await NewsModel.create({
      organizationId: org.id,
      authorId: post.authorId,
      authorName: post.authorName,
      authorRole: post.authorRole,
      title: post.title,
      content: post.content,
    });
  }

  console.log(`Seed: created ${posts.length} news posts for "${org.name}"`);
}
