export const RANKING_EXCLUDED_IDENTIFICATIONS: Set<string> = new Set([
  '37a0b1e2-e4ae-4013-aad3-c7e144b54eff',
  '2054fc50-139b-492b-b8f3-66e6854fad7f',
  'e4f2c787-1c7c-46e0-8f80-138e8c867392'
]);

export const getVisibleRankingEntries = <T extends {
  rank: number;
  attendances: number;
  user: { id: string; name: string };
}>(entries: T[]): T[] => {
  const visibleEntries = entries
    .filter((entry) => !RANKING_EXCLUDED_IDENTIFICATIONS.has(String(entry.user.id)))
    .sort((left, right) =>
      right.attendances - left.attendances ||
      left.user.name.localeCompare(right.user.name, 'es'),
    );

  let previousAttendances: number | null = null;
  let previousRank = 0;

  return visibleEntries.map((entry, index) => {
    if (entry.attendances !== previousAttendances) {
      previousRank = index + 1;
      previousAttendances = entry.attendances;
    }

    return { ...entry, rank: previousRank };
  });
};
