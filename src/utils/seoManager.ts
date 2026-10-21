import { SITE_DOMAIN, LOCAL_BUSINESS_SCHEMA, FAQ_SCHEMA, generateArticleSchema, generateBreadcrumbSchema } from '../data/seoData';
import { BLOG_POSTS } from '../data/blogData';
import { SERVICES_DATA } from '../data/servicesData';

export interface PageSeoConfig {
  title: string;
  description: string;
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogType: string;
  twitterCard: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  jsonLd?: object[];
}

// Single easy-to-change branded 1200x630 share image value
export const DEFAULT_OG_IMAGE = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop';

export const PAGE_SHARE_IMAGES = {
  home: DEFAULT_OG_IMAGE,
  services: DEFAULT_OG_IMAGE,
  documents: DEFAULT_OG_IMAGE,
  branches: DEFAULT_OG_IMAGE,
  reviews: DEFAULT_OG_IMAGE,
  company: DEFAULT_OG_IMAGE,
  blog: DEFAULT_OG_IMAGE,
  faq: DEFAULT_OG_IMAGE
};

export function getSeoConfigForPage(pageKey: string, articleSlug?: string): PageSeoConfig {
  const baseUrl = SITE_DOMAIN;

  let pageData: {
    title: string;
    description: string;
    canonicalUrl: string;
    ogType?: string;
    jsonLd?: object[];
  };

  switch (pageKey) {
    case 'home':
      pageData = {
        title: 'Smart Life Typing Services Sharjah | Family Visa, Emirates ID & MoHRE',
        description: 'Approved UAE government typing center in Abu Shagara & Al Majaz 1, Sharjah. Specialized in Family Residence Visas, Emirates ID, MoHRE Contracts, Golden Visa, Certificate Attestation & Passport Renewal.',
        canonicalUrl: `${baseUrl}/`,
        ogType: 'website',
        jsonLd: [
          LOCAL_BUSINESS_SCHEMA,
          generateBreadcrumbSchema([{ name: 'Home', url: `${baseUrl}/` }])
        ]
      };
      break;

    case 'services':
      pageData = {
        title: 'Government Typing Services & Visa Fee Checklist | Smart Life Sharjah',
        description: 'Complete list of official government typing services in Sharjah: Family Visa Stamping, Tourist Visa, MoHRE Labour Contracts, Golden Visa Applications, MoFA Attestation, & Alhind Indian Passport Renewal.',
        canonicalUrl: `${baseUrl}/services/`,
        ogType: 'website',
        jsonLd: [
          {
            "@context": "https://schema.org",
            "@type": "GovernmentService",
            "name": "Smart Life Government Typing Services Sharjah",
            "serviceType": "Visa & Documentation Processing",
            "provider": {
              "@type": "LocalBusiness",
              "name": "Smart Life Typing Services Sharjah"
            },
            "areaServed": "Sharjah & All Emirates, UAE"
          },
          generateBreadcrumbSchema([
            { name: 'Home', url: `${baseUrl}/` },
            { name: 'Services', url: `${baseUrl}/services/` }
          ])
        ]
      };
      break;

    case 'service-detail': {
      const targetService = SERVICES_DATA.find(s => s.id === articleSlug) || SERVICES_DATA[0];
      const serviceTitle = `${targetService.title} Sharjah | Smart Life Typing`;
      const serviceDesc = `${targetService.shortDesc} Fast typing & document processing in Sharjah. ${targetService.requiredDocuments.length} key required documents. Official processing time: ${targetService.processingTime}.`;
      const serviceUrl = `${baseUrl}/services/${targetService.id}/`;

      pageData = {
        title: serviceTitle,
        description: serviceDesc,
        canonicalUrl: serviceUrl,
        ogType: 'service',
        jsonLd: [
          {
            "@context": "https://schema.org",
            "@type": "GovernmentService",
            "name": `${targetService.title} Sharjah`,
            "serviceType": targetService.categoryLabel || "Government Typing Service",
            "description": targetService.shortDesc,
            "provider": {
              "@type": "LocalBusiness",
              "name": "Smart Life Typing Services Sharjah"
            },
            "areaServed": "Sharjah & All UAE Emirates"
          },
          generateBreadcrumbSchema([
            { name: 'Home', url: `${baseUrl}/` },
            { name: 'Services', url: `${baseUrl}/services/` },
            { name: targetService.title, url: serviceUrl }
          ])
        ]
      };
      break;
    }

    case 'branches':
      pageData = {
        title: 'Sharjah Branch Locations & Contact Details | Smart Life Typing',
        description: 'Visit our customer service counters in Abu Shagara (Mirza Building) and Al Majaz 1 (Safeer Building), Sharjah. Abu Shagara: All Days (No Holiday) | Al Majaz: All Days Except Sunday.',
        canonicalUrl: `${baseUrl}/branches/`,
        ogType: 'place',
        jsonLd: [
          LOCAL_BUSINESS_SCHEMA,
          generateBreadcrumbSchema([
            { name: 'Home', url: `${baseUrl}/` },
            { name: 'Branches', url: `${baseUrl}/branches/` }
          ])
        ]
      };
      break;

    case 'branch-abu-shagara':
      pageData = {
        title: 'Smart Life Typing & Studio Abu Shagara Main Branch | Sharjah UAE',
        description: 'Shop No. 3, Mirza Building, 14 Salem Bin Omair Street, Abu Shagara, Sharjah. Working Hours: 9:00 AM – 11:00 PM All Days. Call or WhatsApp +971 55 158 5570.',
        canonicalUrl: `${baseUrl}/branches/abu-shagara/`,
        ogType: 'place',
        jsonLd: [
          LOCAL_BUSINESS_SCHEMA,
          generateBreadcrumbSchema([
            { name: 'Home', url: `${baseUrl}/` },
            { name: 'Branches', url: `${baseUrl}/branches/` },
            { name: 'Abu Shagara Main Branch', url: `${baseUrl}/branches/abu-shagara/` }
          ])
        ]
      };
      break;

    case 'branch-al-majaz':
      pageData = {
        title: 'Smart Life Typing & Studio Al Majaz Branch | Sharjah UAE',
        description: 'Safeer Building, Shop No. 2, Al Majaz 1, Sharjah. Working Hours: 8:00 AM – 8:00 PM (Monday-Saturday). Call or WhatsApp +971 50 229 0133.',
        canonicalUrl: `${baseUrl}/branches/al-majaz/`,
        ogType: 'place',
        jsonLd: [
          LOCAL_BUSINESS_SCHEMA,
          generateBreadcrumbSchema([
            { name: 'Home', url: `${baseUrl}/` },
            { name: 'Branches', url: `${baseUrl}/branches/` },
            { name: 'Al Majaz Branch', url: `${baseUrl}/branches/al-majaz/` }
          ])
        ]
      };
      break;

    case 'reviews':
      pageData = {
        title: '240+ Verified 5-Star Google Reviews | Smart Life Typing Sharjah',
        description: 'Read real verified customer reviews and 4.9-star ratings for Smart Life Typing Services in Sharjah. See why 10,000+ residents trust us for fast visa and document clearances.',
        canonicalUrl: `${baseUrl}/reviews/`,
        ogType: 'website',
        jsonLd: [
          {
            "@context": "https://schema.org",
            "@type": "AggregateRating",
            "itemReviewed": {
              "@type": "LocalBusiness",
              "name": "Smart Life Typing Services Sharjah",
              "image": DEFAULT_OG_IMAGE,
              "telephone": "+971-55-158-5570"
            },
            "ratingValue": "4.9",
            "reviewCount": "240",
            "bestRating": "5"
          },
          generateBreadcrumbSchema([
            { name: 'Home', url: `${baseUrl}/` },
            { name: 'Reviews', url: `${baseUrl}/reviews/` }
          ])
        ]
      };
      break;

    case 'company':
      pageData = {
        title: 'About Smart Life Typing Services | Official Government Partner Sharjah',
        description: 'Learn about Smart Life Typing Services in Sharjah, UAE. Over 10 years of professional government document typing, legal translation, and visa clearances.',
        canonicalUrl: `${baseUrl}/company/`,
        ogType: 'website',
        jsonLd: [
          generateBreadcrumbSchema([
            { name: 'Home', url: `${baseUrl}/` },
            { name: 'About Us', url: `${baseUrl}/company/` }
          ])
        ]
      };
      break;

    case 'blog':
      pageData = {
        title: 'UAE Visa Rules & Government Guides 2026 | Smart Life Typing',
        description: 'Official guides and updates on Sharjah Family Residence Visa, Golden Visa rules, MoHRE Labour Contracts, Certificate Attestation, and Indian Passport Renewal.',
        canonicalUrl: `${baseUrl}/guides/`,
        ogType: 'website',
        jsonLd: [
          generateBreadcrumbSchema([
            { name: 'Home', url: `${baseUrl}/` },
            { name: 'Guides', url: `${baseUrl}/guides/` }
          ])
        ]
      };
      break;

    case 'blog-article': {
      const article = BLOG_POSTS.find(p => p.slug === articleSlug) || BLOG_POSTS[0];
      const articleUrl = `${baseUrl}/guides/${article.slug}/`;
      const articleTitle = `${article.title} | Smart Life Guide`;
      const articleDesc = article.summary;

      pageData = {
        title: articleTitle,
        description: articleDesc,
        canonicalUrl: articleUrl,
        ogType: 'article',
        jsonLd: [
          generateArticleSchema(article),
          generateBreadcrumbSchema([
            { name: 'Home', url: `${baseUrl}/` },
            { name: 'Guides', url: `${baseUrl}/guides/` },
            { name: article.title, url: articleUrl }
          ])
        ]
      };
      break;
    }

    case 'faq':
      pageData = {
        title: 'Frequently Asked Questions & Answers | Smart Life Typing Sharjah',
        description: 'Find clear answers to common questions on Sharjah family visa salary limits, medical fitness typing times, Emirates ID processing, MoFA attestation, and branch timings.',
        canonicalUrl: `${baseUrl}/faq/`,
        ogType: 'website',
        jsonLd: [
          FAQ_SCHEMA,
          generateBreadcrumbSchema([
            { name: 'Home', url: `${baseUrl}/` },
            { name: 'FAQ', url: `${baseUrl}/faq/` }
          ])
        ]
      };
      break;

    case 'privacy':
      pageData = {
        title: 'Privacy Policy | Smart Life Typing Services Sharjah',
        description: 'Read the privacy policy of Smart Life Typing Services in Sharjah, UAE. Information on user data protection and privacy compliance.',
        canonicalUrl: `${baseUrl}/privacy-policy/`,
        ogType: 'website',
        jsonLd: [
          generateBreadcrumbSchema([
            { name: 'Home', url: `${baseUrl}/` },
            { name: 'Privacy Policy', url: `${baseUrl}/privacy-policy/` }
          ])
        ]
      };
      break;

    default:
      pageData = {
        title: 'Smart Life Typing Services Sharjah | Family Visa & Government Documentation',
        description: 'Trusted UAE typing and visa center in Sharjah.',
        canonicalUrl: `${baseUrl}/`,
        ogType: 'website'
      };
      break;
  }

  return {
    title: pageData.title,
    description: pageData.description,
    canonicalUrl: pageData.canonicalUrl,
    ogTitle: pageData.title,
    ogDescription: pageData.description,
    ogImage: DEFAULT_OG_IMAGE,
    ogType: pageData.ogType || 'website',
    twitterCard: 'summary_large_image',
    twitterTitle: pageData.title,
    twitterDescription: pageData.description,
    twitterImage: DEFAULT_OG_IMAGE,
    jsonLd: pageData.jsonLd
  };
}

// Applies metadata dynamically to document head tags
export function updateDomMetadata(config: PageSeoConfig) {
  if (typeof document === 'undefined') return;

  // 1. Page Title
  document.title = config.title;

  // Helper to set or create meta tag
  const setMeta = (attrName: string, attrVal: string, contentVal: string) => {
    let tag = document.querySelector(`meta[${attrName}="${attrVal}"]`);
    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute(attrName, attrVal);
      document.head.appendChild(tag);
    }
    tag.setAttribute('content', contentVal);
  };

  // Helper to set or create link tag
  const setLink = (relVal: string, hrefVal: string) => {
    let link = document.querySelector(`link[rel="${relVal}"]`);
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', relVal);
      document.head.appendChild(link);
    }
    link.setAttribute('href', hrefVal);
  };

  // 2. Standard Meta Tags
  setMeta('name', 'description', config.description);
  setLink('canonical', config.canonicalUrl);

  // 3. OpenGraph Tags (Page-Specific)
  setMeta('property', 'og:title', config.ogTitle);
  setMeta('property', 'og:description', config.ogDescription);
  setMeta('property', 'og:image', config.ogImage);
  setMeta('property', 'og:url', config.canonicalUrl);
  setMeta('property', 'og:type', config.ogType);
  setMeta('property', 'og:site_name', 'Smart Life Typing Services Sharjah');

  // 4. Twitter Card Tags (Page-Specific)
  setMeta('name', 'twitter:card', config.twitterCard);
  setMeta('name', 'twitter:title', config.twitterTitle);
  setMeta('name', 'twitter:description', config.twitterDescription);
  setMeta('name', 'twitter:image', config.twitterImage);

  // 5. Remove meta keywords from DOM if present
  const metaKeywords = document.querySelector('meta[name="keywords"]');
  if (metaKeywords) {
    metaKeywords.remove();
  }

  // 6. Dynamic JSON-LD Scripts
  const existingDynamicLds = document.querySelectorAll('script[data-seo-dynamic="true"]');
  existingDynamicLds.forEach(el => el.remove());

  if (config.jsonLd && config.jsonLd.length > 0) {
    config.jsonLd.forEach((schemaObj, idx) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-seo-dynamic', 'true');
      script.id = `seo-dynamic-schema-${idx}`;
      script.text = JSON.stringify(schemaObj);
      document.head.appendChild(script);
    });
  }
}
