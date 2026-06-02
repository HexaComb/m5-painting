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
}

export interface HeroContent {
  _id: string;
  _creationTime: number;
  headline: string;
  highlightText: string;
  bodyText: string;
  ctaText: string;
  ctaPhone: string;
}

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
}

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
}

export interface Review {
  _id: string;
  _creationTime: number;
  order: number;
  text: string;
  author: string;
  date: string;
  source: string;
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
  contactContent: ContactContent | null;
}
