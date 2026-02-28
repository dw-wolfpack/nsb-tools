/**
 * Golden fixture samples for deal-teaser-analyzer tests.
 * Covers: $699,000, 699k, 0.7M, conflicting numbers.
 */
export const DEAL_TEASER_SAMPLES = {
  withDollarCommas:
    "Established SaaS business for sale. Asking price $699,000. Revenue $120k/year. Strong margins.",
  withK:
    "E-commerce brand. Price 699k. Cash flow 5k/month. Quick sale.",
  withDecimalM:
    "Profitable agency. Valuation 0.7M. Owner retiring.",
  conflictingNumbers:
    "Business listed at $500,000. Seller says $699,000 firm. Revenue reported 100k and 150k.",
  empty: "",
};
