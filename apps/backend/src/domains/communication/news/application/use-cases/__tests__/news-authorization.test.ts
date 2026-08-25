import { describe, it, expect } from "vitest";

import { CreateNewsUseCase } from "../CreateNewsUseCase.js";
import { DeleteNewsUseCase } from "../DeleteNewsUseCase.js";
import { UserRole } from "../../../../../identity/domain/constants/UserRole.js";

/**
 * BUSINESS-LOGIC REGRESSION TESTS: the real authorization rules
 * behind News - who can post (Faculty, Org Admin, Placement Admin
 * only, matching the exact roles named in the request) and who can
 * remove a post (its own author, or an Org Admin of the same
 * organization).
 */
describe("CreateNewsUseCase - role enforcement", () => {
  function makeUseCase() {
    const repository = {
      async create(news: unknown) {
        return news;
      },
    };
    const userRepository = {
      async findById() {
        return { id: "user-1", name: "Jane Faculty" };
      },
    };
    return new CreateNewsUseCase(repository as any, userRepository as any);
  }

  const dto = { title: "Test", content: "Test content" };

  it("allows FACULTY to post news", async () => {
    const useCase = makeUseCase();
    await expect(useCase.execute(dto, "org-1", "user-1", UserRole.FACULTY)).resolves.toBeDefined();
  });

  it("allows ORG_ADMIN to post news", async () => {
    const useCase = makeUseCase();
    await expect(useCase.execute(dto, "org-1", "user-1", UserRole.ORG_ADMIN)).resolves.toBeDefined();
  });

  it("allows PLACEMENT_ADMIN to post news", async () => {
    const useCase = makeUseCase();
    await expect(useCase.execute(dto, "org-1", "user-1", UserRole.PLACEMENT_ADMIN)).resolves.toBeDefined();
  });

  it("rejects STUDENT posting news", async () => {
    const useCase = makeUseCase();
    await expect(useCase.execute(dto, "org-1", "user-1", UserRole.STUDENT)).rejects.toMatchObject({ statusCode: 403 });
  });

  it("rejects RECRUITER posting news", async () => {
    const useCase = makeUseCase();
    await expect(useCase.execute(dto, "org-1", "user-1", UserRole.RECRUITER)).rejects.toMatchObject({ statusCode: 403 });
  });

  it("rejects ALUMNI posting news", async () => {
    const useCase = makeUseCase();
    await expect(useCase.execute(dto, "org-1", "user-1", UserRole.ALUMNI)).rejects.toMatchObject({ statusCode: 403 });
  });
});

describe("DeleteNewsUseCase - ownership enforcement", () => {
  function makeUseCase(existing: { organizationId: string; authorId: string } | null) {
    const repository = {
      async findById() {
        return existing;
      },
      async delete() {
        return undefined;
      },
    };
    return new DeleteNewsUseCase(repository as any);
  }

  it("allows the original author to delete their own post", async () => {
    const useCase = makeUseCase({ organizationId: "org-1", authorId: "faculty-1" });
    await expect(useCase.execute("news-1", "org-1", "faculty-1", UserRole.FACULTY)).resolves.toBeUndefined();
  });

  it("allows ORG_ADMIN to delete someone else's post in their own org", async () => {
    const useCase = makeUseCase({ organizationId: "org-1", authorId: "faculty-1" });
    await expect(useCase.execute("news-1", "org-1", "admin-1", UserRole.ORG_ADMIN)).resolves.toBeUndefined();
  });

  it("rejects a different FACULTY member deleting someone else's post", async () => {
    const useCase = makeUseCase({ organizationId: "org-1", authorId: "faculty-1" });
    await expect(useCase.execute("news-1", "org-1", "faculty-2", UserRole.FACULTY)).rejects.toMatchObject({ statusCode: 403 });
  });

  it("rejects deleting a post that belongs to a different organization", async () => {
    const useCase = makeUseCase({ organizationId: "org-2", authorId: "admin-1" });
    await expect(useCase.execute("news-1", "org-1", "admin-1", UserRole.ORG_ADMIN)).rejects.toMatchObject({ statusCode: 404 });
  });

  it("rejects deleting a post that does not exist", async () => {
    const useCase = makeUseCase(null);
    await expect(useCase.execute("news-1", "org-1", "admin-1", UserRole.ORG_ADMIN)).rejects.toMatchObject({ statusCode: 404 });
  });
});
