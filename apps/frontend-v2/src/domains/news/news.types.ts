/** Matches the real backend NewsResponseDto exactly. */
export interface News {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  createdAt?: string;
}

/** Matches the real backend CreateNewsSchema exactly. */
export interface CreateNewsRequest {
  title: string;
  content: string;
}
