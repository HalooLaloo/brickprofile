// User profile
export interface Profile {
  id: string;
  email: string;
  company_name: string | null;
  phone: string | null;
  plan: "free" | "pro";
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  subscription_status: string;
  created_at: string;
}

// Service definition
export interface Service {
  name: string;
  description: string;
  icon?: string;
}

// Website/Site configuration
export interface Site {
  id: string;
  user_id: string;
  slug: string;
  custom_domain: string | null;
  company_name: string;
  headline: string | null;
  about_text: string | null;
  services: Service[] | null;
  service_areas: string[] | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  template: "classic" | "modern" | "bold" | "minimal";
  primary_color: string;
  logo_url: string | null;
  quotesnap_user_id: string | null;
  show_quote_button: boolean;
  google_reviews_url: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

// Photo categories
export type PhotoCategory =
  | "bathroom"
  | "kitchen"
  | "roofing"
  | "painting"
  | "flooring"
  | "exterior"
  | "landscaping"
  | "electrical"
  | "plumbing"
  | "hvac"
  | "general"
  | "other";

// Portfolio photo
export interface Photo {
  id: string;
  site_id: string;
  user_id: string;
  url: string;
  thumbnail_url: string | null;
  category: PhotoCategory | null;
  caption: string | null;
  is_before_after: boolean;
  pair_id: string | null;
  is_before: boolean | null;
  sort_order: number;
  created_at: string;
}

// Review/Testimonial
export interface Review {
  id: string;
  site_id: string;
  client_name: string;
  client_location: string | null;
  rating: number;
  text: string;
  project_type: string | null;
  created_at: string;
}

// Analytics entry
export interface Analytics {
  id: string;
  site_id: string;
  date: string;
  page_views: number;
  unique_visitors: number;
  quote_clicks: number;
  phone_clicks: number;
}

// AI generation request/response types
export interface GenerateContentRequest {
  answers: {
    companyName: string;
    services: string[];
    experience: string;
    areas: string[];
    specialties?: string;
  };
}

export interface GenerateContentResponse {
  headline: string;
  aboutText: string;
  serviceDescriptions: Record<string, string>;
}

export interface CategorizePhotoRequest {
  imageUrl: string;
}

export interface CategorizePhotoResponse {
  category: PhotoCategory;
  suggestedCaption: string;
}

// Onboarding state
export interface OnboardingState {
  step: number;
  answers: {
    companyName: string;
    services: string[];
    experience: string;
    areas: string[];
    specialties: string;
    phone: string;
    email: string;
  };
  generatedContent: GenerateContentResponse | null;
  uploadedPhotos: Photo[];
  selectedTemplate: Site["template"];
  primaryColor: string;
}

// Template props
export interface TemplateProps {
  site: Site;
  photos: Photo[];
  reviews: Review[];
  isPreview?: boolean;
}

// Plan limits
export const PLAN_LIMITS = {
  free: {
    maxPhotos: 10,
    maxReviews: 5,
    maxSites: 1,
    customDomain: false,
    removeBranding: false,
    fullAnalytics: false,
    emailNotifications: false,
    googleReviewsLink: false,
    socialContentGenerator: false,
  },
  pro: {
    maxPhotos: 1000,
    maxReviews: 1000,
    maxSites: 10,
    customDomain: true,
    removeBranding: true,
    fullAnalytics: true,
    emailNotifications: true,
    googleReviewsLink: true,
    socialContentGenerator: true,
  },
} as const;

// Prices (for display)
export const PRICES = {
  pro: {
    monthly: 19.99,
    currency: "USD",
  },
} as const;
