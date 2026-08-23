import type {
  SiteSettings,
  HeroContent,
  Service,
  AboutContent,
  AboutImage,
  AboutValue,
  InstagramPost,
  Review,
  Certification,
  ContactContent,
} from "./content-types";
import {
  DEFAULT_ABOUT_IMAGE,
  DEFAULT_ABOUT_IMAGE_ALT,
  DEFAULT_HERO_MEDIA_ALT,
  DEFAULT_HERO_MEDIA_TYPE,
  DEFAULT_HERO_VIDEO,
} from "./content-types";

export const defaultSiteSettings: SiteSettings = {
  _id: "default",
  _creationTime: Date.now(),
  businessName: "M5 Painting",
  tagline: "Family-Owned Since Day One",
  phone: "559-451-1022",
  email: "m5paintingco@gmail.com",
  address: "Sanger, CA · Central Valley",
  metaDescription:
    "Sanger painters for homes and businesses across the Central Valley. Family-owned M5 Painting — residential, commercial, interior, and exterior painting. Free estimates.",
};

export const defaultHeroContent: HeroContent = {
  _id: "default",
  _creationTime: Date.now(),
  headline: "Painting done right,",
  highlightText: "by people who care.",
  bodyText:
    "Local Sanger painters for homes and businesses across the Central Valley — from the first walkthrough to the final coat.",
  ctaText: "Get a Free Estimate",
  ctaPhone: "559-451-1022",
  mediaUrl: DEFAULT_HERO_VIDEO,
  mediaType: DEFAULT_HERO_MEDIA_TYPE,
  mediaAlt: DEFAULT_HERO_MEDIA_ALT,
};

export const defaultServices: Service[] = [
  {
    _id: "s1",
    _creationTime: Date.now(),
    order: 1,
    iconName: "Home",
    title: "Interior Painting",
    description:
      "Whether it's a single room or your whole house, we'll help you pick the perfect colors and make sure every wall, trim, and ceiling looks beautiful.",
    items: [
      "Single Room to Entire Home",
      "Textured & Faux Painting",
      "Wallpaper Removal",
      "Cabinet Refinishing",
      "Crown Molding & Trim",
      "Garage Floor Coating",
    ],
  },
  {
    _id: "s2",
    _creationTime: Date.now(),
    order: 2,
    iconName: "Paintbrush",
    title: "Exterior Painting",
    description:
      "Your home's first impression matters. We use top-quality paints and proven techniques so your exterior holds up against the Valley heat for years.",
    items: [
      "Stucco & Plaster",
      "Wood & Vinyl Siding",
      "Trim, Fence & Deck",
      "Brick Treatments",
      "Concrete Staining",
      "Pressure Washing",
    ],
  },
  {
    _id: "s3",
    _creationTime: Date.now(),
    order: 3,
    iconName: "Building2",
    title: "Commercial Painting",
    description:
      "We work with local businesses, offices, and property managers to keep their spaces looking sharp. Big job or small, same attention to detail.",
    items: [
      "Office & Retail",
      "Restaurants & Hotels",
      "Healthcare Facilities",
      "Warehouses & Industrial",
      "Multi-Family Housing",
      "Gyms & Fitness",
    ],
  },
  {
    _id: "s4",
    _creationTime: Date.now(),
    order: 4,
    iconName: "MessageSquare",
    title: "Free Consultation",
    description:
      "Not sure where to start? Give us a call. We'll walk the job with you, talk through your ideas, and give you an honest quote.",
    items: [
      "On-Site Walkthrough",
      "Detailed Written Quote",
      "Color Advice",
      "No Obligation",
    ],
  },
];

export const defaultAboutContent: AboutContent = {
  _id: "default",
  _creationTime: Date.now(),
  subtitle: "The Family Behind Every Coat",
  title: "Built on Hard Work & Handshakes",
  paragraphs: [
    "M5 Painting started the way most good things do: a family that knows how to work hard. We grew up right here in the Central Valley, and when we started this business, we made a simple promise: treat every customer like a neighbor, because around here, they usually are.",
    "Matt and the crew bring that same small-town work ethic to every project. We show up on time, do quality work, and don't leave until you love it. That's not a sales pitch; it's just how we were raised.",
  ],
  imageUrl: DEFAULT_ABOUT_IMAGE,
  imageAlt: DEFAULT_ABOUT_IMAGE_ALT,
};

export const defaultAboutImages: AboutImage[] = [];

export const defaultAboutValues: AboutValue[] = [
  {
    _id: "v1",
    _creationTime: Date.now(),
    order: 1,
    iconName: "Heart",
    title: "We Care Like Family",
    description:
      "Your home is where your family makes memories. We show up with the same care we'd bring to our own parents' house.",
  },
  {
    _id: "v2",
    _creationTime: Date.now(),
    order: 2,
    iconName: "Handshake",
    title: "Honest From Day One",
    description:
      "No hidden fees, no surprises, no cutting corners. A fair quote, on time, and happy before we pack up.",
  },
  {
    _id: "v3",
    _creationTime: Date.now(),
    order: 3,
    iconName: "Shield",
    title: "Licensed, Bonded & Insured",
    description:
      "Fully licensed, bonded, and insured. You can relax knowing your property is protected.",
  },
  {
    _id: "v4",
    _creationTime: Date.now(),
    order: 4,
    iconName: "Palette",
    title: "Your Vision, Our Hands",
    description:
      "We listen to what you want and bring it to life, whether that's a bold accent wall or a complete refresh.",
  },
];

export const defaultInstagramPosts: InstagramPost[] = [];

export const defaultReviews: Review[] = [
  {
    _id: "r1",
    _creationTime: Date.now(),
    order: 1,
    text: "Great to work with. Very happy with the job Matt and his crew did on the exterior of our home. It was a big project. I would recommend them to have a job done right.",
    author: "Kara B.",
    date: "June 2025",
    source: "Yelp",
  },
  {
    _id: "r2",
    _creationTime: Date.now(),
    order: 2,
    text: "Matt and his M5 painting team were amazing. Signed, Sealed and Delivered. Finished the inside of my rental home in one day! On time and very professional. I would recommend M5 to anyone.",
    author: "Nick C.",
    date: "June 2025",
    source: "Yelp",
  },
  {
    _id: "r3",
    _creationTime: Date.now(),
    order: 3,
    text: "I highly recommend M5 Painting for any exterior paint work! They did an outstanding job on my home. From the stucco to the trim, everything looks fresh, clean, and professionally done. They helped me choose the perfect color for the stucco, and their attention to detail on the trimming made a huge difference.",
    author: "Krystle P.",
    date: "June 2025",
    source: "Angi",
  },
  {
    _id: "r4",
    _creationTime: Date.now(),
    order: 4,
    text: "Matt and his crew did an amazing job of meeting all our needs and expectations! The time and quality of work was outstanding. Would highly recommend!",
    author: "Victoria F.",
    date: "June 2025",
    source: "Angi",
  },
];

export const defaultCertifications: Certification[] = [
  {
    _id: "c1",
    _creationTime: Date.now(),
    order: 1,
    label: "Licensed, Bonded & Insured",
    imageUrl: "/images/lbi-badge.webp",
    showInHero: true,
    showInFooter: true,
    enabled: true,
  },
  {
    _id: "c2",
    _creationTime: Date.now(),
    order: 2,
    label: "BBB Accredited Business",
    imageUrl: "/images/bbb-badge.svg",
    showInHero: true,
    showInFooter: true,
    enabled: true,
  },
  {
    _id: "c3",
    _creationTime: Date.now(),
    order: 3,
    label: "SEA Certified",
    imageUrl: "/images/sea-badge.svg",
    showInHero: true,
    showInFooter: true,
    enabled: true,
  },
  {
    _id: "c4",
    _creationTime: Date.now(),
    order: 4,
    label: "5-Star Rated on Yelp & Angi",
    imageUrl: "/images/quality-badge.webp",
    showInHero: false,
    showInFooter: true,
    enabled: true,
  },
];

export const defaultContactContent: ContactContent = {
  _id: "default",
  _creationTime: Date.now(),
  subtitle: "We'd Love to Hear From You",
  title: "Ready to Get Started?",
  description:
    "Drop us a message or give us a call. We'll come out, take a look, and give you an honest, no-pressure quote.",
  phone: "559-451-1022",
  email: "m5paintingco@gmail.com",
  location: "Sanger, CA · Central Valley",
};
