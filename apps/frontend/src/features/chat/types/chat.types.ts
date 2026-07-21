import { ChatType } from "@/types/enums";

/**
 * Mirrors ChatResponseDto exactly. Chat is available to every role
 * EXCEPT SUPER_ADMIN — confirmed this milestone, stated outright in
 * the backend's own route comment ("Chat is available to every role
 * except SUPER_ADMIN"), matching navRegistry's pre-existing note.
 * Unlike the ORG_ADMIN-only-management pattern seen in Placements,
 * this excludes SUPER_ADMIN from the ENTIRE feature (create, list,
 * get, send, list messages, mark read) — every other non-SUPER_ADMIN
 * role has full access.
 */
export interface ChatResponseDto {
  id: string;
  organizationId: string;
  participants: string[];
  type: ChatType;
  createdAt?: string;
}

/**
 * Mirrors MessageResponseDto exactly. `isRead` here (unlike
 * Notifications' per-viewer computed field) is presumably a simple
 * boolean set by MarkMessageReadUseCase — no readBy array, since
 * messages have a single sender and (for DIRECT chats) a single other
 * recipient.
 */
export interface MessageResponseDto {
  id: string;
  chatId: string;
  senderId: string;
  message: string;
  attachments: string[];
  isRead: boolean;
  createdAt?: string;
}

/**
 * Mirrors CreateChatDto. The creator's own userId is added to
 * participantIds automatically server-side (deduplicated) — only the
 * OTHER participant(s) need to be listed here. DIRECT (the default
 * when `type` is omitted) requires exactly 2 total participants
 * ("A direct chat requires exactly two participants.", 400). Creating
 * a DIRECT chat between two users who already have one is idempotent
 * — the backend returns the EXISTING chat rather than erroring or
 * duplicating, confirmed this milestone.
 */
export interface CreateChatPayload {
  participantIds: string[];
  type?: ChatType;
}

/** Mirrors SendMessageDto */
export interface SendMessagePayload {
  message: string;
  attachments?: string[];
}
