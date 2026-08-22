/** Small, dependency-free helpers for picking realistic, varied seed data - no randomness library needed for this scale. */

export function pick<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

export function pickMany<T>(items: T[], count: number): T[] {
  const shuffled = [...items].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, items.length));
}

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** True with the given probability (0-1), used to realistically vary submission/application outcomes rather than an even split. */
export function chance(probability: number): boolean {
  return Math.random() < probability;
}
