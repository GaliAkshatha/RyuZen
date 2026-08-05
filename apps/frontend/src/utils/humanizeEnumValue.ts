/**
 * Converts a raw backend enum value (SCREAMING_SNAKE_CASE, matching
 * every constants file across the backend, e.g. AssessmentType,
 * NotificationType, ActivityType) into a real, human-readable label -
 * confirmed against a real screenshot showing "FORM", "SEMESTER",
 * "ANNOUNCEMENT", "ALERT" rendered raw in Select dropdowns across
 * multiple forms. Every place that maps an enum's values into
 * SelectItem/StatusBadge/etc. text should go through this, not
 * `{value}` directly.
 *
 * A small, deliberate allowlist keeps real acronyms uppercase rather
 * than title-casing them into something wrong ("MCQ_SINGLE" ->
 * "Mcq Single" would be worse than what it replaces) - extend this
 * list as new acronym-bearing enums are added, rather than
 * hand-writing a full label map per enum.
 */
const KEEP_UPPERCASE = new Set([
  "AI",
  "QR",
  "MCQ",
  "HR",
  "GPA",
  "CGPA",
  "USN",
  "ID",
  "URL",
  "OA",
]);

export function humanizeEnumValue(value: string | undefined | null): string {
  if (!value) return "";

  return value
    .split("_")
    .filter(Boolean)
    .map((word) => {
      if (KEEP_UPPERCASE.has(word)) return word;
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
}
