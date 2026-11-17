/**
 * Ignite Students (K-12) and Ignite Higher Ed: the prices and review flag the
 * /schools and /colleges pages share. Change a price here and both the page
 * text and the first-year estimator follow.
 *
 * Sources (none invented):
 * - session: the $1,500 group experience on the 2026 menu, as Bill described it
 *   (email, 16 November 2026).
 * - certPerTool, k12LicenseBase, k12PerClass, workbookTiers: the Wildfire Menu of
 *   Services, July 2025 copy ("Mission Portrait certification $300", "7 Igniters
 *   certification $300", "Ignite Academy curriculum $1,500 per year + $500 per
 *   section", the digital student workbook volume table).
 * Confirm each against the 2026 Ignite menu before this goes live.
 */
export const PRICES = {
  session: 1500,
  certPerTool: 300,
  tools: 2,
  k12LicenseBase: 1500,
  k12PerClass: 500,
  /** [minimum students, Mission Portrait only, Mission Portrait + 7 Igniters], per student, digital workbook */
  workbookTiers: [
    [10000, 3.0, 5.4], [5000, 3.5, 6.3], [2000, 4.0, 7.2], [1000, 5.0, 9.0], [500, 6.0, 10.8],
    [200, 7.0, 12.6], [100, 10.0, 18.0], [50, 25.0, 45.0], [20, 28.0, 50.4], [10, 30.0, 54.0], [1, 35.0, 63.0],
  ] as [number, number, number][],
};

/**
 * While true, the pages show dashed "to add" slots and "to confirm" notes so
 * Bill, Stephanie and Will can see what is still missing. Set to false only
 * when every slot has real content or has been removed.
 */
export const REVIEW = true;

export const usd = (n: number) =>
  '$' + n.toLocaleString('en-US', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 });

export const plural = (n: number, one: string, many = one + 's') => `${n} ${n === 1 ? one : many}`;

export const certCost = (people: number) => people * PRICES.certPerTool * PRICES.tools;

export const k12License = (classes: number) => PRICES.k12LicenseBase + classes * PRICES.k12PerClass;

/** Volume price that never rises when students are removed. */
export function workbooks(n: number, withIgniters: boolean) {
  const col = withIgniters ? 2 : 1;
  const at = PRICES.workbookTiers.find((t) => n >= t[0])!;
  let best = n * at[col];
  let each = at[col];
  let billed = n;
  for (const t of PRICES.workbookTiers) {
    if (t[0] > n && t[0] * t[col] < best) {
      best = t[0] * t[col];
      each = t[col];
      billed = t[0];
    }
  }
  return { cost: Math.round(best * 100) / 100, each, billed };
}
