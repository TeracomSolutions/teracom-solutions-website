// The Result column of the admin Resources table: the problems of the last
// check, one short line until opened (Robert, 2026-09-29).
export function splitProblems(text) {
  if (!text) return [];
  return text.split('; ').map(p => p.trim()).filter(p => p);
}

export function problemsLine(text) {
  const problems = splitProblems(text);
  if (problems.length === 0) return '';
  if (problems.length === 1) {
    const problem = problems[0];
    return problem.length > 90 ? problem.substring(0, 87) + '…' : problem;
  }
  return `${problems.length} issues from the last check (click to see them)`;
}