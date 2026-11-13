/**
 * One place for the facts about Wildfire Leadership that pages, structured
 * data (JSON-LD) and llms.txt repeat. Every value here is already stated
 * somewhere on the public site. Do not add a fact (address, phone, prices,
 * ratings) unless the site says it on a page a visitor can see.
 *
 * Location: Will confirmed on 2026-11-12 that Bill and Stephanie are based in
 * Charleston, South Carolina. City and state only: no street address, no
 * claim of in-person meetings, no service radius until the family confirms.
 *
 * The production host is www.wildfireleadership.com (the bare domain
 * redirects there). It comes from `site` in astro.config.mjs.
 */

export const SITE_URL = (import.meta.env.SITE ?? 'https://www.wildfireleadership.com').replace(/\/$/, '');

export const abs = (path = '/') => new URL(path, SITE_URL + '/').href;

export const ORG_NAME = 'Wildfire Leadership';
export const ORG_LEGAL_NAME = 'Wildfire Leadership, LLC';
export const EMAIL = 'info@wildfireleadership.com';
export const INSTAGRAM_URL = 'https://www.instagram.com/wildfireleadership/';
export const INVEST_URL = 'https://invest.wildfireleadership.com';
export const IGNITE_URL = 'https://www.theigniteacademy.org/';
export const STEPHANIE_SITE_URL = 'https://www.stephanielammers.com/';

/** Shown in the footer, About, Contact and the homepage intro. */
export const BASED_IN = 'Charleston, South Carolina';

/** Stable identifiers so every page describes the same entities. */
export const ids = {
  organization: `${SITE_URL}/#organization`,
  website: `${SITE_URL}/#website`,
  bill: `${SITE_URL}/team/#bill-lammers`,
  stephanie: `${SITE_URL}/team/#stephanie-lammers`,
  tiffany: `${SITE_URL}/team/#tiffany-rodriguez`,
};

/** Footer wording, used as the organization description everywhere. */
export const ORG_DESCRIPTION =
  'Wildfire Leadership offers practical, visual tools proven to help individuals, families, and organizations uncover purpose and unleash potential, built on two proprietary frameworks: the Mission Portrait™ and the 7 Igniters™.';

/** Who the organization is. Sent on every page. */
export const organization = {
  '@type': 'Organization',
  '@id': ids.organization,
  name: ORG_NAME,
  legalName: ORG_LEGAL_NAME,
  url: `${SITE_URL}/`,
  logo: {
    '@type': 'ImageObject',
    url: abs('/images/logo-dark.png'),
  },
  image: abs('/images/hero-main.jpg'),
  description: ORG_DESCRIPTION,
  slogan: 'Uncover Purpose. Unleash Potential.',
  email: EMAIL,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Charleston',
    addressRegion: 'SC',
    addressCountry: 'US',
  },
  sameAs: [INSTAGRAM_URL],
  founder: [
    { '@type': 'Person', '@id': ids.bill, name: 'Bill Lammers' },
    { '@type': 'Person', '@id': ids.stephanie, name: 'Stephanie Lammers' },
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    email: EMAIL,
    url: abs('/contact/'),
    availableLanguage: 'English',
  },
  knowsAbout: [
    'Leadership development',
    'Leadership coaching',
    'Executive coaching',
    'Team building',
    'Purpose discovery',
    'Mission Portrait™',
    '7 Igniters™',
    'Working Genius',
    'DISC',
    'Marriage enrichment',
  ],
};

export const website = {
  '@type': 'WebSite',
  '@id': ids.website,
  name: ORG_NAME,
  url: `${SITE_URL}/`,
  inLanguage: 'en-US',
  publisher: { '@id': ids.organization },
};

export interface Crumb {
  name: string;
  path: string;
}

export function breadcrumbList(crumbs: Crumb[]) {
  const all = [{ name: 'Home', path: '/' }, ...crumbs];
  return {
    '@type': 'BreadcrumbList',
    itemListElement: all.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: abs(c.path),
    })),
  };
}

/** Plain text from a short HTML answer (links and emphasis only). */
export const stripHtml = (s: string) =>
  s
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();

export interface Faq {
  q: string;
  /** May contain simple inline HTML such as links. */
  a: string;
}

/** FAQPage for a visible FAQ section. Text must match what the page shows. */
export function faqPage(path: string, faqs: Faq[]) {
  return {
    '@type': 'FAQPage',
    '@id': `${abs(path)}#faq`,
    url: abs(path),
    isPartOf: { '@id': ids.website },
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: stripHtml(f.q),
      acceptedAnswer: { '@type': 'Answer', text: stripHtml(f.a) },
    })),
  };
}

export const provider = { '@id': ids.organization };
