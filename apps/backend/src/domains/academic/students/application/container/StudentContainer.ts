import { StudentRepository } from "../../infrastructure/repositories/StudentRepository.js";

import { UserRepository } from "../../../../identity/infrastructure/repositories/UserRepository.js";

import { DepartmentRepository } from "../../../departments/infrastructure/repositories/DepartmentRepository.js";

import { FacultyRepository } from "../../../faculty/infrastructure/repositories/FacultyRepository.js";

import { MentorshipRepository } from "../../../mentorship/infrastructure/repositories/MentorshipRepository.js";

import { CreateStudentUseCase } from "../use-cases/CreateStudentUseCase.js";
import { GetStudentUseCase } from "../use-cases/GetStudentUseCase.js";
import { GetStudentsUseCase } from "../use-cases/GetStudentsUseCase.js";
import { UpdateStudentUseCase } from "../use-cases/UpdateStudentUseCase.js";
import { AssignMentorUseCase } from "../use-cases/AssignMentorUseCase.js";
import { PromoteSemesterUseCase } from "../use-cases/PromoteSemesterUseCase.js";
import { ArchiveStudentUseCase } from "../use-cases/ArchiveStudentUseCase.js";

const studentRepository = new StudentRepository();

const userRepository = new UserRepository();

const departmentRepository = new DepartmentRepository();

const facultyRepository = new FacultyRepository();

const mentorshipRepository = new MentorshipRepository();

export const studentContainer = {

    createStudent:

        new CreateStudentUseCase(

            studentRepository,

            userRepository,

            departmentRepository

        ),

    getStudent:

        new GetStudentUseCase(
            studentRepository
        ),

    getStudents:

        new GetStudentsUseCase(
            studentRepository
        ),

    updateStudent:

        new UpdateStudentUseCase(
            studentRepository
        ),

    assignMentor:

        new AssignMentorUseCase(

            studentRepository,

            facultyRepository,

            mentorshipRepository

        ),

    promoteSemester:

        new PromoteSemesterUseCase(
            studentRepository
        ),

    archiveStudent:

        new ArchiveStudentUseCase(
            studentRepository
        )

};
