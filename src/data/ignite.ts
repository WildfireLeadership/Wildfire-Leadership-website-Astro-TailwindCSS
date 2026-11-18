/**
 * Ignite Students (K-12) and Ignite Higher Ed: the prices the /schools and /colleges
 * pages share. Change a price here and the page text and the college estimator follow.
 *
 * Sources, all from Bill's emails to Will of 17 November 2026 (nothing invented):
 * - K-12: the example he sent Laura Young at Parkway. A leadership Mission Portrait
 *   session is $1,500 for up to 12 leaders; for a small administrator group he honored
 *   $249 a person. The public page shows only this first step. Certification and the
 *   annual school license are quoted per school, and the license tiers and what each
 *   includes are confirmed with Bill before they are ever published.
 * - Higher Ed: the CSU menu. A two-hour Mission Portrait leadership experience is
 *   $1,500, or four hours with Working Genius $2,200, for up to 12 leaders, plus $150
 *   per additional person. Facilitator certification is $300 per person, per track.
 *   The annual license starts at $5,000 for a pilot cohort or single program, $6,500
 *   for incoming freshmen and $9,000 campus-wide. Final pricing scales with enrollment.
 */
export const PRICES = {
  session: 1500,
  sessionWithWorkingGenius: 2200,
  sessionLeaders: 12,
  extraPerson: 150,
  smallGroupPerPerson: 249,
  certPerTrack: 300,
  /** The two certification tracks: the Mission Portrait and the 7 Igniters. */
  tracks: 2,
  collegeLicense: [
    { key: 'pilot', label: 'Pilot cohort or single program', price: 5000 },
    { key: 'freshmen', label: 'Incoming freshmen', price: 6500 },
    { key: 'campus', label: 'Campus-wide', price: 9000 },
  ],
};

export const usd = (n: number) =>
  '$' + n.toLocaleString('en-US', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 });

export const plural = (n: number, one: string, many = one + 's') => `${n} ${n === 1 ? one : many}`;

/** Certification for `people` facilitators in `tracks` tracks. */
export const certCost = (people: number, tracks = PRICES.tracks) => people * tracks * PRICES.certPerTrack;

/** A leadership session for `leaders` people: the base covers 12, then $150 each. */
export const sessionCost = (leaders: number, withWorkingGenius = false) =>
  (withWorkingGenius ? PRICES.sessionWithWorkingGenius : PRICES.session) +
  Math.max(0, leaders - PRICES.sessionLeaders) * PRICES.extraPerson;

/** 7igniters.com's overview in the general edition: a sample student roadmap, no sign-in. */
export const IGNITERS_SAMPLE = 'https://7igniters.com/overview';
