import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// DOM and Storage shims for Node.js SSR execution
if (typeof globalThis.localStorage === 'undefined') {
  globalThis.localStorage = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
    clear: () => {}
  };
}

if (typeof globalThis.window === 'undefined') {
  globalThis.window = {
    location: { pathname: '/', hash: '', search: '', origin: 'https://smartlifetypingservices.com' },
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  };
}

async function runPrerender() {
  console.log('🚀 Starting Pre-rendering for Smart Life Typing Services...');

  // 1. Build the SSR bundle
  console.log('📦 Building SSR bundle...');
  execSync('npx vite build --ssr src/prerenderEntry.tsx --outDir dist-ssr', {
    stdio: 'inherit',
    cwd: __dirname
  });

  // 2. Import the compiled renderPage function
  const ssrModulePath = path.join(__dirname, 'dist-ssr', 'prerenderEntry.js');
  const { renderPage } = await import(`file://${ssrModulePath.replace(/\\/g, '/')}`);

  // 3. Read template HTML produced by standard client build
  const templatePath = path.join(__dirname, 'dist', 'index.html');
  if (!fs.existsSync(templatePath)) {
    throw new Error('dist/index.html not found! Run "vite build" first.');
  }
  const templateHtml = fs.readFileSync(templatePath, 'utf-8');

  // 4. Approved indexable routes list (Trailing slash standardized)
  const routes = [
    '/',
    '/services/',
    '/branches/',
    '/reviews/',
    '/company/',
    '/guides/',
    '/faq/',
    '/privacy-policy/',
    '/branches/abu-shagara/',
    '/branches/al-majaz/',
    '/services/family-visa/',
    '/services/tourist-visit-visa/',
    '/services/labour-visa/',
    '/services/indian-passport-renewal/',
    '/services/certificate-attestation/',
    '/services/emirates-id-typing/',
    '/services/company-setup-pro/',
    '/services/saudi-visa-typing/',
    '/services/police-clearance-certificate/',
    '/guides/sharjah-family-visa-renewal-guide/',
    '/guides/uae-certificate-attestation-guide/',
    '/guides/indian-passport-renewal-uae-consular-guide/',
    '/guides/mohre-labour-contract-rules-uae/'
  ];

  console.log(`📄 Pre-rendering ${routes.length} static HTML pages...`);

  for (const route of routes) {
    const {
      html,
      title,
      description,
      canonical,
      ogTitle,
      ogDescription,
      ogUrl,
      twitterTitle,
      twitterDescription,
      ogImage,
      twitterImage
    } = renderPage(route);

    let pageHtml = templateHtml;

    // Update Page Title
    if (title) {
      pageHtml = pageHtml.replace(/<title>.*?<\/title>/, `<title>${title}</title>`);
    }

    // Update Meta Description
    if (description) {
      pageHtml = pageHtml.replace(
        /<meta\s+name=["']description["']\s+content=["'].*?["']\s*\/?>/i,
        `<meta name="description" content="${description.replace(/"/g, '&quot;')}" />`
      );
    }

    // Update Self-Referencing Canonical
    if (canonical) {
      pageHtml = pageHtml.replace(
        /<link\s+rel=["']canonical["']\s+href=["'].*?["']\s*\/?>/i,
        `<link rel="canonical" href="${canonical}" />`
      );
    }

    // Update Page-Specific OpenGraph Title
    const finalOgTitle = ogTitle || title;
    if (finalOgTitle) {
      pageHtml = pageHtml.replace(
        /<meta\s+property=["']og:title["']\s+content=["'].*?["']\s*\/?>/i,
        `<meta property="og:title" content="${finalOgTitle.replace(/"/g, '&quot;')}" />`
      );
    }

    // Update Page-Specific OpenGraph Description
    const finalOgDesc = ogDescription || description;
    if (finalOgDesc) {
      pageHtml = pageHtml.replace(
        /<meta\s+property=["']og:description["']\s+content=["'].*?["']\s*\/?>/i,
        `<meta property="og:description" content="${finalOgDesc.replace(/"/g, '&quot;')}" />`
      );
    }

    // Update Page-Specific OpenGraph URL
    const finalOgUrl = ogUrl || canonical;
    if (finalOgUrl) {
      if (/<meta\s+property=["']og:url["']/i.test(pageHtml)) {
        pageHtml = pageHtml.replace(
          /<meta\s+property=["']og:url["']\s+content=["'].*?["']\s*\/?>/i,
          `<meta property="og:url" content="${finalOgUrl}" />`
        );
      } else {
        pageHtml = pageHtml.replace(
          /(<link\s+rel=["']canonical["'].*?>)/i,
          `<meta property="og:url" content="${finalOgUrl}" />\n  $1`
        );
      }
    }

    // Update OpenGraph Image if provided
    if (ogImage) {
      pageHtml = pageHtml.replace(
        /<meta\s+property=["']og:image["']\s+content=["'].*?["']\s*\/?>/i,
        `<meta property="og:image" content="${ogImage}" />`
      );
    }

    // Update Page-Specific Twitter Title
    const finalTwitterTitle = twitterTitle || title;
    if (finalTwitterTitle) {
      pageHtml = pageHtml.replace(
        /<meta\s+name=["']twitter:title["']\s+content=["'].*?["']\s*\/?>/i,
        `<meta name="twitter:title" content="${finalTwitterTitle.replace(/"/g, '&quot;')}" />`
      );
    }

    // Update Page-Specific Twitter Description
    const finalTwitterDesc = twitterDescription || description;
    if (finalTwitterDesc) {
      pageHtml = pageHtml.replace(
        /<meta\s+name=["']twitter:description["']\s+content=["'].*?["']\s*\/?>/i,
        `<meta name="twitter:description" content="${finalTwitterDesc.replace(/"/g, '&quot;')}" />`
      );
    }

    // Update Twitter Image if provided
    if (twitterImage) {
      pageHtml = pageHtml.replace(
        /<meta\s+name=["']twitter:image["']\s+content=["'].*?["']\s*\/?>/i,
        `<meta name="twitter:image" content="${twitterImage}" />`
      );
    }

    // Ensure no keywords meta tag exists in rendered static HTML
    pageHtml = pageHtml.replace(/<meta\s+name=["']keywords["'].*?\/?>\s*/gi, '');

    // Insert Pre-rendered Content into root
    pageHtml = pageHtml.replace(
      '<div id="root"></div>',
      `<div id="root">${html}</div>`
    );

    // Write to destination
    if (route === '/' || route === '') {
      fs.writeFileSync(path.join(__dirname, 'dist', 'index.html'), pageHtml, 'utf-8');
      console.log('  ✓ / -> dist/index.html');
    } else {
      const cleanPath = route.replace(/^\//, '').replace(/\/$/, '');
      const destDir = path.join(__dirname, 'dist', cleanPath);
      fs.mkdirSync(destDir, { recursive: true });
      fs.writeFileSync(path.join(destDir, 'index.html'), pageHtml, 'utf-8');
      console.log(`  ✓ ${route} -> dist/${cleanPath}/index.html`);
    }
  }

  // 5. Clean up temporary dist-ssr directory
  try {
    fs.rmSync(path.join(__dirname, 'dist-ssr'), { recursive: true, force: true });
  } catch {
    // ignore
  }

  console.log('✨ All 23 static pages pre-rendered successfully with full HTML source!');
  process.exit(0);
}

runPrerender().catch((err) => {
  console.error('❌ Pre-rendering failed:', err);
  process.exit(1);
});
