// Utility for handling group value for students

/**
 * Returns a normalized group value for a student.
 * If no group is selected, returns an empty string.
 */
export function normalizeStudentGroup(group: string | undefined | null): string {
  return group && group.trim() ? group : '';
}
