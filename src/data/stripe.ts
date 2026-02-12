/**
 * Stripe Payment Link URLs
 *
 * Paste your real Stripe Payment Link URLs below after creating them
 * in the Stripe Dashboard. While empty, buttons fall back to the contact form.
 *
 * Each link should have:
 *  - Adjustable quantity (1–99)
 *  - Custom dropdown: "This is for my..." → Student, Individual, Marriage, Family, Organization
 */

export const stripeLinks = {
  missionPortrait: {
    selfGuided: "",   // e.g. "https://buy.stripe.com/abc123"
    facilitated: "",  // e.g. "https://buy.stripe.com/def456"
  },
  sevenIgniters: {
    selfGuided: "",   // e.g. "https://buy.stripe.com/ghi789"
    facilitated: "",  // e.g. "https://buy.stripe.com/jkl012"
  },
} as const;

/** Returns the Stripe URL if configured, otherwise a contact-form fallback. */
export function checkoutUrl(stripeUrl: string, fallbackInterest: string, fallbackType: string): string {
  return stripeUrl || `/contact?interest=${fallbackInterest}&type=${fallbackType}`;
}

/** Whether a Stripe URL is actually configured (non-empty). */
export function isStripeConfigured(url: string): boolean {
  return url.length > 0;
}
