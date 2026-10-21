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

  // 4. Approved indexable routes list
  const routes = [
    '/',
    '/services',
    '/branches',
    '/reviews',
    '/company',
    '/guides',
    '/faq',
    '/privacy-policy',
    '/branches/abu-shagara',
    '/branches/al-majaz',
    '/services/family-visa',
    '/services/tourist-visit-visa',
    '/services/labour-visa',
    '/services/indian-passport-renewal',
    '/services/certificate-attestation',
    '/services/emirates-id-typing',
    '/services/company-setup-pro',
    '/services/saudi-visa-typing',
    '/services/police-clearance-certificate',
    '/guides/sharjah-family-visa-renewal-guide',
    '/guides/uae-certificate-attestation-guide',
    '/guides/indian-passport-renewal-uae-consular-guide',
    '/guides/mohre-labour-contract-rules-uae'
  ];

  console.log(`📄 Pre-rendering ${routes.length} static HTML pages...`);

  for (const route of routes) {
    const { html, title, description, canonical } = renderPage(route);

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
      const destDir = path.join(__dirname, 'dist', route.replace(/^\//, ''));
      fs.mkdirSync(destDir, { recursive: true });
      fs.writeFileSync(path.join(destDir, 'index.html'), pageHtml, 'utf-8');
      console.log(`  ✓ ${route} -> dist${route}/index.html`);
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
