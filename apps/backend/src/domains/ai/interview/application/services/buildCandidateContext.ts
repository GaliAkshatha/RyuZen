import { IPortfolioProjectRepository } from "../../../../career/portfolio/infrastructure/repositories/IPortfolioProjectRepository.js";
import { ISkillRepository } from "../../../../career/skills/infrastructure/repositories/ISkillRepository.js";

/**
 * Builds a real, evidence-based summary of the student's own
 * portfolio for the interview question prompt - the same real
 * projects and APPROVED (not raw AI-suggested, not pending) skills
 * that appear on their actual profile. Deliberately excludes
 * unapproved skill suggestions - an interview shouldn't ask about a
 * skill the student themselves hasn't confirmed is real.
 *
 * Returns an empty string for a student with no portfolio yet - a
 * real, valid state, not an error. The prompt layer treats that as
 * "no specific project context available" and falls back to
 * role-general questions.
 */
export async function buildCandidateContext(

    userId: string,

    projectRepository: IPortfolioProjectRepository,

    skillRepository: ISkillRepository

): Promise<string> {

    const [projects, skills] = await Promise.all([

        projectRepository.findByUserId(userId),

        skillRepository.findByUserId(userId)

    ]);

    const approvedSkills =
        skills.filter(skill => skill.approved);

    const parts: string[] = [];

    if (projects.length > 0) {

        const projectLines = projects

            .slice(0, 5)

            .map(project => {

                const stack =
                    project.techStack.length > 0
                        ? ` (${project.techStack.join(", ")})`
                        : "";

                const description =
                    project.description
                        ? ` — ${project.description}`
                        : "";

                return `- ${project.title}${stack}${description}`;

            })

            .join("\n");

        parts.push(`Real projects from this candidate's portfolio:\n${projectLines}`);

    }

    if (approvedSkills.length > 0) {

        const skillNames =
            approvedSkills

                .slice(0, 15)

                .map(skill => skill.name)

                .join(", ");

        parts.push(`Approved skills on this candidate's profile: ${skillNames}`);

    }

    return parts.join("\n\n");

}
