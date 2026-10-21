import { BRANCHES_DATA } from './branchesData';
import { FAQS_DATA } from './faqsData';
import { SERVICES_DATA } from './servicesData';
import { BLOG_POSTS, BlogPost } from './blogData';
import { ServiceItem } from '../types';

export const SITE_DOMAIN = 'https://smartlifetypingservices.com';

export const LOCAL_BUSINESS_SCHEMA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "LocalBusiness",
      "@id": `${SITE_DOMAIN}/branches/abu-shagara/`,
      "name": "Smart Life Typing & Studio - Abu Shagara Main Branch",
      "alternateName": "Smart Life Typing Sharjah",
      "url": `${SITE_DOMAIN}/branches/abu-shagara/`,
      "logo": `${SITE_DOMAIN}/logo.png`,
      "description": "Trusted UAE-based typing, visa, photo studio, and government services provider in Abu Shagara, Sharjah. Specialized in Family Visa, Medical Fitness, Emirates ID, SEWA, MoHRE, Attestation, and Indian Passport services.",
      "telephone": "+971-55-158-5570",
      "sameAs": [
        "https://share.google/RoOf22nDXMTzvu44F"
      ],
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Shop No. 3, Mirza Building, 14 Salem Bin Omair Street, Abu Shagara",
        "addressLocality": "Abu Shagara",
        "addressRegion": "Sharjah",
        "postalCode": "61168",
        "addressCountry": "AE"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 25.3463,
        "longitude": 55.3864
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "148",
        "bestRating": "5",
        "worstRating": "1"
      },
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
          "opens": "09:00",
          "closes": "23:00"
        },
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Friday"],
          "opens": "09:00",
          "closes": "12:00"
        },
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Friday"],
          "opens": "16:00",
          "closes": "23:00"
        }
      ],
      "areaServed": [
        { "@type": "AdministrativeArea", "name": "Sharjah" },
        { "@type": "AdministrativeArea", "name": "Dubai" },
        { "@type": "AdministrativeArea", "name": "Abu Dhabi" },
        { "@type": "AdministrativeArea", "name": "Ajman" },
        { "@type": "AdministrativeArea", "name": "Ras Al Khaimah" },
        { "@type": "AdministrativeArea", "name": "Fujairah" },
        { "@type": "AdministrativeArea", "name": "Umm Al Quwain" }
      ],
      "priceRange": "$$"
    },
    {
      "@type": "LocalBusiness",
      "@id": `${SITE_DOMAIN}/branches/al-majaz/`,
      "name": "Smart Life Typing & Studio - Al Majaz Branch",
      "url": `${SITE_DOMAIN}/branches/al-majaz/`,
      "telephone": "+971-50-229-0133",
      "sameAs": [
        "https://share.google/rIhEXUZKW3lbeGl2o"
      ],
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Safeer Building, Shop No. 2, Al Majaz 1",
        "addressLocality": "Al Majaz 1",
        "addressRegion": "Sharjah",
        "postalCode": "61168",
        "addressCountry": "AE"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 25.3375,
        "longitude": 55.3812
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "92",
        "bestRating": "5",
        "worstRating": "1"
      },
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
          "opens": "08:00",
          "closes": "20:00"
        }
      ],
      "areaServed": "Sharjah"
    }
  ]
};

export const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": FAQS_DATA.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
};

export function generateArticleSchema(post: BlogPost) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.summary,
    "articleSection": post.category,
    "author": {
      "@type": "Organization",
      "name": post.author,
      "url": `${SITE_DOMAIN}/`
    },
    "publisher": {
      "@type": "Organization",
      "name": "Smart Life Typing Services Sharjah",
      "url": `${SITE_DOMAIN}/`,
      "logo": {
        "@type": "ImageObject",
        "url": `${SITE_DOMAIN}/logo.png`
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${SITE_DOMAIN}/guides/${post.slug}/`
    },
    "about": {
      "@type": "GovernmentService",
      "name": post.category,
      "areaServed": "Sharjah, UAE"
    },
    "abstract": post.keyTakeaways.join(" "),
    "inLanguage": "en-AE"
  };
}

export function generateGovernmentServiceSchema(service: ServiceItem) {
  return {
    "@context": "https://schema.org",
    "@type": "GovernmentService",
    "@id": `${SITE_DOMAIN}/services/${service.id}/`,
    "name": `${service.title} Sharjah`,
    "serviceType": service.categoryLabel || "Government Typing & Documentation",
    "description": service.shortDesc,
    "provider": {
      "@type": "LocalBusiness",
      "name": "Smart Life Typing Services Sharjah",
      "telephone": "+971-55-158-5570",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Sharjah",
        "addressCountry": "AE"
      }
    },
    "areaServed": {
      "@type": "AdministrativeArea",
      "name": "Sharjah & All UAE Emirates"
    },
    "termsOfService": `${SITE_DOMAIN}/services/${service.id}/`,
    "serviceOutput": service.title,
    "offers": {
      "@type": "Offer",
      "price": "Contact for Official Typing Fees",
      "priceCurrency": "AED",
      "availability": "https://schema.org/InStock"
    }
  };
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
}

export function generateXmlSitemap(dynamicServices?: ServiceItem[], dynamicBlogs?: BlogPost[]): string {
  const currentDate = new Date().toISOString().split('T')[0];
  const servicesList = dynamicServices && dynamicServices.length > 0 ? dynamicServices : SERVICES_DATA;
  const blogsList = dynamicBlogs && dynamicBlogs.length > 0 ? dynamicBlogs : BLOG_POSTS;

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  // Main Landing Pages
  xml += `  <url>\n    <loc>${SITE_DOMAIN}/</loc>\n  </url>\n`;
  xml += `  <url>\n    <loc>${SITE_DOMAIN}/services/</loc>\n  </url>\n`;
  xml += `  <url>\n    <loc>${SITE_DOMAIN}/branches/</loc>\n  </url>\n`;
  xml += `  <url>\n    <loc>${SITE_DOMAIN}/reviews/</loc>\n  </url>\n`;
  xml += `  <url>\n    <loc>${SITE_DOMAIN}/company/</loc>\n  </url>\n`;
  xml += `  <url>\n    <loc>${SITE_DOMAIN}/guides/</loc>\n  </url>\n`;
  xml += `  <url>\n    <loc>${SITE_DOMAIN}/faq/</loc>\n  </url>\n`;
  xml += `  <url>\n    <loc>${SITE_DOMAIN}/privacy-policy/</loc>\n  </url>\n`;

  // Branches
  BRANCHES_DATA.forEach(branch => {
    const slug = branch.slug || (branch.id === 'main-branch' ? 'abu-shagara' : 'al-majaz');
    xml += `  <url>\n    <loc>${SITE_DOMAIN}/branches/${slug}/</loc>\n  </url>\n`;
  });

  // Dynamic Service Deep Linking URLs
  servicesList.forEach(service => {
    xml += `  <url>\n    <loc>${SITE_DOMAIN}/services/${service.id}/</loc>\n  </url>\n`;
  });

  // Blog Guides Articles
  blogsList.forEach(post => {
    xml += `  <url>\n    <loc>${SITE_DOMAIN}/guides/${post.slug}/</loc>\n  </url>\n`;
  });

  xml += `</urlset>`;
  return xml;
}

export function generateRobotsTxt(): string {
  return `User-agent: *
Allow: /
Disallow: /private/
Disallow: /admin/

# GEO & Local Search Targeted Sitemap
Sitemap: ${SITE_DOMAIN}/sitemap.xml
`;
}
