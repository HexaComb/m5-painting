export interface SiteSettings {
  _id: string;
  _creationTime: number;
  businessName: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  metaDescription: string;
  googlePlaceId?: string;
  instagramUsername?: string;
}

export interface HeroContent {
  _id: string;
  _creationTime: number;
  headline: string;
  highlightText: string;
  bodyText: string;
  ctaText: string;
  ctaPhone: string;
  mediaUrl?: string;
  mediaType?: HeroMediaType;
  mediaAlt?: string;
}

export type HeroMediaType = "image" | "video";

export const DEFAULT_HERO_VIDEO = "/videos/m5easyprocess-720p.mp4";
export const DEFAULT_HERO_VIDEO_ALT =
  "M5 Painting crew working on a home exterior in the Central Valley";
export const DEFAULT_HERO_IMAGE = "/images/project-door.webp";
export const DEFAULT_HERO_IMAGE_ALT =
  "Freshly painted home exterior with crisp trim work by M5 Painting";
export const DEFAULT_HERO_MEDIA_TYPE: HeroMediaType = "video";
export const DEFAULT_HERO_MEDIA_ALT = DEFAULT_HERO_VIDEO_ALT;

export interface Service {
  _id: string;
  _creationTime: number;
  order: number;
  iconName: string;
  title: string;
  description: string;
  items: string[];
}

export interface AboutContent {
  _id: string;
  _creationTime: number;
  subtitle: string;
  title: string;
  paragraphs: string[];
  imageUrl?: string;
  imageAlt?: string;
}

export const DEFAULT_ABOUT_IMAGE = "/images/team-collage.webp";
export const DEFAULT_ABOUT_IMAGE_ALT =
  "Matt and the M5 Painting crew on a job site";

export interface AboutValue {
  _id: string;
  _creationTime: number;
  order: number;
  iconName: string;
  title: string;
  description: string;
}

export interface InstagramPost {
  _id: string;
  _creationTime: number;
  order: number;
  embedUrl: string;
  enabled?: boolean;
  instagramMediaId?: string;
  thumbnailUrl?: string;
}

export interface Review {
  _id: string;
  _creationTime: number;
  order: number;
  text: string;
  author: string;
  date: string;
  source: string;
  enabled?: boolean;
  rating?: number;
  googleReviewId?: string;
  profilePhotoUrl?: string;
  authorUri?: string;
}

export interface Certification {
  _id: string;
  _creationTime: number;
  order: number;
  label: string;
  imageUrl?: string;
  showInHero: boolean;
  showInFooter: boolean;
  enabled?: boolean;
}

export interface ContactContent {
  _id: string;
  _creationTime: number;
  subtitle: string;
  title: string;
  description: string;
  phone: string;
  email: string;
  location: string;
}

export interface SiteContent {
  siteSettings: SiteSettings | null;
  heroContent: HeroContent | null;
  services: Service[] | null;
  aboutContent: AboutContent | null;
  aboutValues: AboutValue[] | null;
  instagramPosts: InstagramPost[] | null;
  reviews: Review[] | null;
  certifications: Certification[] | null;
  contactContent: ContactContent | null;
}
