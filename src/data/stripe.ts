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
    selfGuided: "https://buy.stripe.com/aFacN44WD7ht4EC0Mc2880b",
    facilitated: "https://buy.stripe.com/dRm3cubl159l3Ay52s2880c",
  },
  sevenIgniters: {
    selfGuided: "https://buy.stripe.com/9B6aEWfBh8lxefc0Mc2880d",
    facilitated: "https://buy.stripe.com/00w6oG1Kr45h2wu2Uk2880e",
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
