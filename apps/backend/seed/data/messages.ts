import { ConnectionRequestModel } from "../../src/domains/community/connections/infrastructure/persistence/ConnectionRequestModel.js";
import { ChatModel } from "../../src/domains/communication/chat/infrastructure/persistence/ChatModel.js";
import { MessageModel } from "../../src/domains/communication/chat/infrastructure/persistence/MessageModel.js";
import { ChatType } from "../../src/domains/communication/chat/domain/constants/ChatType.js";

import { pick, pickMany, randomInt } from "../utils/random.js";
import type { SeededStudent } from "../types.js";

const SAMPLE_EXCHANGES: { first: string; second: string }[] = [
  { first: "Hey! Saw you're going for the same drive - good luck with it.", second: "Thanks! You too, let me know how your interview goes." },
  { first: "Are you joining the workshop this weekend?", second: "Yeah, planning to. Should be useful for the upcoming activities." },
  { first: "Congrats on the leaderboard rank!", second: "Thank you! Still catching up to you though." },
  { first: "Did you submit the assignment yet?", second: "Just submitted it, cutting it close to the deadline as usual." },
];

/**
 * Creates real conversations between real ACCEPTED connections - a
 * chat only exists where a real, accepted ConnectionRequest already
 * does, matching how a real conversation could genuinely start on
 * this platform. Guarantees the demo-designated student
 * (student1@<code>.edu) has at least one real conversation: confirmed
 * via a real screenshot that seedConnections' fully random 60% accept
 * chance meant the demo account could easily show "No conversations
 * yet" - if no accepted connection already touches them, one is
 * created directly before seeding their conversation, the same
 * guarantee pattern already used for their leaderboard standing.
 */
export async function seedMessages(organizationId: string, students: SeededStudent[]): Promise<void> {
  const acceptedConnections = await ConnectionRequestModel.find({ organizationId, status: "ACCEPTED" });
  let created = 0;

  const demoStudent = students.find((s) => s.email.startsWith("student1@"));

  if (demoStudent) {
    const hasAccepted = acceptedConnections.some(
      (c) => c.fromUserId.toString() === demoStudent.userId || c.toUserId.toString() === demoStudent.userId,
    );

    if (!hasAccepted) {
      const otherStudent = students.find((s) => s.userId !== demoStudent.userId);
      if (otherStudent) {
        const guaranteed = await ConnectionRequestModel.create({
          organizationId,
          fromUserId: demoStudent.userId,
          toUserId: otherStudent.userId,
          status: "ACCEPTED",
          respondedAt: new Date(),
        });
        acceptedConnections.push(guaranteed);
      }
    }
  }

  const connectionsToSeed = pickMany(acceptedConnections, Math.min(4, acceptedConnections.length));

  for (const connection of connectionsToSeed) {
    const participantA = connection.fromUserId.toString();
    const participantB = connection.toUserId.toString();

    const chat = await ChatModel.create({
      organizationId,
      participants: [participantA, participantB],
      type: ChatType.DIRECT,
    });

    const exchange = pick(SAMPLE_EXCHANGES);
    let timestamp = new Date(Date.now() - randomInt(1, 6) * 24 * 60 * 60 * 1000);

    await MessageModel.create({
      chatId: chat._id,
      senderId: participantA,
      message: exchange.first,
      attachments: [],
      readBy: [participantA, participantB],
      createdAt: timestamp,
    });

    timestamp = new Date(timestamp.getTime() + randomInt(2, 30) * 60 * 1000);

    await MessageModel.create({
      chatId: chat._id,
      senderId: participantB,
      message: exchange.second,
      attachments: [],
      readBy: [participantB],
      createdAt: timestamp,
    });

    created++;
  }

  console.log(`Seed: created ${created} conversation(s) with messages`);
}
