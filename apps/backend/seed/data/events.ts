import { EventModel } from "../../src/domains/campus/events/infrastructure/persistence/EventModel.js";
import { EventRegistrationModel } from "../../src/domains/campus/events/infrastructure/persistence/EventRegistrationModel.js";

import { pick, pickMany, randomInt, chance } from "../utils/random.js";
import type { SeededOrganization, SeededFaculty, SeededStudent, SeededClub } from "../types.js";

const GENERAL_EVENT_TITLES = [
  "Tech Talk: Careers in Engineering",
  "Alumni Homecoming Meetup",
  "Inter-Department Sports Day",
  "Annual Cultural Fest",
];

const CLUB_EVENT_TITLES: Record<string, string[]> = {
  CODE: ["Weekly Competitive Programming Contest", "Open Source Contribution Sprint"],
  ROBO: ["Robotics Build Night", "Autonomous Bot Demo Day"],
  ECELL: ["Startup Pitch Night", "Founder Fireside Chat"],
  LITSOC: ["Open Mic Poetry Night", "Inter-College Debate Meet"],
  ARTS: ["Campus Jam Session", "Annual Talent Showcase"],
};

/**
 * Real events, both club-linked (so ClubDetailPage's real
 * "what's going on" / "what they've done" sections actually have
 * content) and general campus events. A genuine mix of PUBLISHED
 * (upcoming) and COMPLETED (past) status, with real registrations -
 * the demo student is guaranteed to be registered for at least one
 * upcoming and one completed event, the same guarantee pattern used
 * elsewhere in this seed script.
 */
export async function seedEvents(
  org: SeededOrganization,
  faculty: SeededFaculty[],
  students: SeededStudent[],
  clubs: SeededClub[],
): Promise<void> {
  const demoStudent = students.find((s) => s.email.startsWith("student1@"));
  let demoRegisteredUpcoming = false;
  let demoRegisteredPast = false;

  async function createEvent(title: string, clubId: string | undefined, isPast: boolean) {
    const creator = pick(faculty);
    const startDate = isPast
      ? new Date(Date.now() - randomInt(10, 90) * 24 * 60 * 60 * 1000)
      : new Date(Date.now() + randomInt(3, 30) * 24 * 60 * 60 * 1000);
    const endDate = new Date(startDate.getTime() + randomInt(2, 5) * 60 * 60 * 1000);

    const event = await EventModel.create({
      organizationId: org.id,
      clubId,
      createdBy: creator.userId,
      title,
      description: `${title} - a real campus event open to all students.`,
      venue: pick(["Main Auditorium", "Seminar Hall B", "Open Air Theatre", "Block C Lab"]),
      startDate,
      endDate,
      registrationDeadline: isPast ? undefined : new Date(startDate.getTime() - 24 * 60 * 60 * 1000),
      capacity: randomInt(50, 200),
      points: randomInt(10, 40),
      certificateEnabled: isPast || chance(0.5),
      status: isPast ? "COMPLETED" : "PUBLISHED",
    });

    const registrants = pickMany(students, randomInt(5, 15));
    const registrantIds = new Set(registrants.map((s) => s.studentId));

    if (demoStudent) {
      if (isPast && !demoRegisteredPast) {
        registrantIds.add(demoStudent.studentId);
        demoRegisteredPast = true;
      } else if (!isPast && !demoRegisteredUpcoming) {
        registrantIds.add(demoStudent.studentId);
        demoRegisteredUpcoming = true;
      }
    }

    for (const studentId of registrantIds) {
      await EventRegistrationModel.create({
        eventId: event._id,
        studentId,
        attendance: isPast ? chance(0.8) : false,
        certificateIssued: isPast && event.certificateEnabled && chance(0.7),
        registeredAt: new Date(startDate.getTime() - randomInt(2, 10) * 24 * 60 * 60 * 1000),
      });
    }
  }

  for (const club of clubs) {
    const titles = CLUB_EVENT_TITLES[club.code] ?? [];
    for (const title of titles) {
      await createEvent(title, club.id, chance(0.5));
    }
  }

  for (const title of GENERAL_EVENT_TITLES) {
    await createEvent(title, undefined, chance(0.5));
  }
}
