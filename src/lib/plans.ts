// Plan limits and features

export const PLAN_LIMITS = {
  free: {
    photos: 10,
    reviews: 5,
    sites: 1,
    customDomain: false,
    removeBranding: false,
    emailNotifications: false,
    googleReviews: false,
    videoEmbed: false,
  },
  pro: {
    photos: 1000, // effectively unlimited
    reviews: 1000,
    sites: 10,
    customDomain: true,
    removeBranding: true,
    emailNotifications: true,
    googleReviews: true,
    videoEmbed: true,
  },
} as const;

export type PlanType = keyof typeof PLAN_LIMITS;

export function getPlanLimits(plan: PlanType) {
  return PLAN_LIMITS[plan] || PLAN_LIMITS.free;
}

export function isProFeature(feature: keyof typeof PLAN_LIMITS.pro): boolean {
  return !PLAN_LIMITS.free[feature];
}
