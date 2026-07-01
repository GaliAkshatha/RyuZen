# Activities Module

## Responsibility

The Activities module manages all academic and extracurricular activities within an organization.

---

## Features

- Create Activity
- Update Activity
- Publish Activity
- Close Activity
- Student Submission
- Faculty Review
- Attendance
- Reports
- CSV Export

---

## Supported Activity Types

- Form
- Assignment
- Workshop
- Seminar
- Hackathon
- Placement Drive
- Quiz

---

## Folder Structure

activities/

├── constants/

├── models/

├── validators/

├── services/

├── controllers/

├── routes/

---

## Development Rules

- Controllers should never contain validation logic.
- Business rules belong in services.
- Database access belongs in services.
- Models only define data structure.