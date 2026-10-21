import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { DocumentChecklistModal } from './components/DocumentChecklistModal';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { HomePage } from './pages/HomePage';
import { ServicesPage } from './pages/ServicesPage';
import { BranchesPage } from './pages/BranchesPage';
import { CompanyPage } from './pages/CompanyPage';
import { BlogPage } from './pages/BlogPage';
import { ArticlePage } from './pages/ArticlePage';
import { ServiceDetailPage } from './pages/ServiceDetailPage';
import { FaqPage } from './pages/FaqPage';
import { ReviewsPage } from './pages/ReviewsPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { ServiceItem } from './types';
import { LOCAL_BUSINESS_SCHEMA, FAQ_SCHEMA } from './data/seoData';
import { getSeoConfigForPage, updateDomMetadata } from './utils/seoManager';
import { AuthProvider, useAuth } from './context/AuthContext';
import { hashSHA256 } from './utils/cryptoHelper';
import { initGlobalWhatsAppTracker } from './utils/whatsappTracker';
import { subscribeServices } from './firebase/dbServices';

// Dynamic Code-Splitting: Admin Panel JS bundle is NEVER downloaded by public visitors.
// It only loads on-demand from the server when secret authorization succeeds.
const AdminLogin = lazy(() => import('./admin/AdminLogin').then(m => ({ default: m.AdminLogin })));
const AdminLayout = lazy(() => import('./admin/AdminLayout').then(m => ({ default: m.AdminLayout })));

// SHA-256 One-Way Cryptographic Checksum of the Secret URL Hash.
const SECRET_HASH_CHECKSUM = 'cbca90c962d9e7d03ee249e062b628f3ea192e1250f9a1d700e39af2a75c9a21';

// Custom Unique Admin Access Path Name (configurable via VITE_ADMIN_SECRET_ROUTE in .env)
export const UNIQUE_ADMIN_ROUTE = (import.meta.env.VITE_ADMIN_SECRET_ROUTE || 'sl-gate-2026').toLowerCase();

function AdminWrapper({ onExitAdmin }: { onExitAdmin: () => void }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-slate-400 text-xs font-['Plus_Jakarta_Sans',sans-serif]">
        Verifying Security Session...
      </div>
    );
  }

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-slate-400 text-xs font-['Plus_Jakarta_Sans',sans-serif]">
        Loading Secure Portal Module...
      </div>
    }>
      {!user ? (
        <AdminLogin 
          onSuccess={() => {}} 
          onCancel={onExitAdmin} 
        />
      ) : (
        <AdminLayout onExitAdmin={onExitAdmin} />
      )}
    </Suspense>
  );
}

function MainContent() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [activeArticleSlug, setActiveArticleSlug] = useState<string>('sharjah-family-visa-renewal-guide');
  const [selectedServiceId, setSelectedServiceId] = useState<string>('family-visa');
  const [selectedBranchSlug, setSelectedBranchSlug] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedServiceDocsId, setSelectedServiceDocsId] = useState<string | null>(null);
  const [liveServicesList, setLiveServicesList] = useState<ServiceItem[]>([]);

  // Real-time subscribe services to keep all global modals & page views updated
  useEffect(() => {
    const unsub = subscribeServices((live) => {
      if (live && live.length > 0) setLiveServicesList(live);
    });
    return () => unsub();
  }, []);

  const activeServiceDocs = selectedServiceDocsId
    ? liveServicesList.find(s => s.id === selectedServiceDocsId) || null
    : null;

  // Derive active SEO config for current page / article / service / branch
  const seoKey = (currentPage === 'branches' && selectedBranchSlug)
    ? (selectedBranchSlug === 'abu-shagara' ? 'branch-abu-shagara' : (selectedBranchSlug === 'al-majaz' ? 'branch-al-majaz' : 'branches'))
    : currentPage;

  const currentSeoConfig = getSeoConfigForPage(
    seoKey,
    currentPage === 'service-detail' ? selectedServiceId : activeArticleSlug
  );

  // Initialize Global Automatic WhatsApp Click Tracker for 100% coverage
  useEffect(() => {
    const cleanup = initGlobalWhatsAppTracker();
    return cleanup;
  }, []);

  // Automatically update HTML head meta tags, title, canonical link, OpenGraph & Twitter cards in background whenever page changes
  useEffect(() => {
    updateDomMetadata(currentSeoConfig);
  }, [currentPage, activeArticleSlug, selectedServiceId, selectedBranchSlug]);

  // Parse URL pathname and hash to route to Admin, Services, Branches, Guides, and core pages
  useEffect(() => {
    const handleUrlRouting = async () => {
      if (typeof window === 'undefined') return;

      const rawHash = window.location.hash.trim().replace(/^#/, '');
      const pathname = window.location.pathname.toLowerCase().replace(/\/+$/, '') || '/';

      // 1. Unique Secret Admin Route
      const targetUniqueRoute = UNIQUE_ADMIN_ROUTE.toLowerCase();
      if (pathname === '/' + targetUniqueRoute || rawHash.toLowerCase() === targetUniqueRoute) {
        setCurrentPage('admin');
        return;
      }

      // Check SHA-256 for admin
      if (rawHash) {
        const computedHash = await hashSHA256(rawHash);
        if (computedHash === SECRET_HASH_CHECKSUM) {
          setCurrentPage('admin');
          return;
        }
      }

      // 2. Services routing
      if (pathname.startsWith('/services/') || pathname.startsWith('/service/')) {
        const id = pathname.replace(/^\/(?:services|service)\//, '').split('/')[0];
        if (id) {
          setSelectedServiceId(id);
          setCurrentPage('service-detail');
          return;
        }
      }
      if (pathname === '/services') {
        setCurrentPage('services');
        return;
      }

      // 3. Branches routing
      if (pathname.startsWith('/branches/') || pathname.startsWith('/branch/')) {
        const slug = pathname.replace(/^\/(?:branches|branch)\//, '').split('/')[0];
        setSelectedBranchSlug(slug);
        setCurrentPage('branches');
        return;
      }
      if (pathname === '/branches') {
        setSelectedBranchSlug(null);
        setCurrentPage('branches');
        return;
      }

      // 4. Guides / Blog routing
      if (pathname.startsWith('/guides/') || pathname.startsWith('/guide/')) {
        const slug = pathname.replace(/^\/(?:guides|guide)\//, '').split('/')[0];
        if (slug) {
          setActiveArticleSlug(slug);
          setCurrentPage('blog-article');
          return;
        }
      }
      if (pathname === '/guides' || pathname === '/blog') {
        setCurrentPage('blog');
        return;
      }

      // 5. Reviews, Company, FAQ, Privacy
      if (pathname === '/reviews') {
        setCurrentPage('reviews');
        return;
      }
      if (pathname === '/company' || pathname === '/about') {
        setCurrentPage('company');
        return;
      }
      if (pathname === '/faq') {
        setCurrentPage('faq');
        return;
      }
      if (pathname === '/privacy-policy' || pathname === '/privacy') {
        setCurrentPage('privacy');
        return;
      }

      // 6. Legacy Hash Fallbacks
      if (rawHash.toLowerCase().startsWith('service/')) {
        const id = rawHash.replace(/service\//i, '');
        if (id) {
          setSelectedServiceId(id);
          setCurrentPage('service-detail');
          return;
        }
      }
      if (rawHash.toLowerCase().startsWith('guide/')) {
        const slug = rawHash.replace(/guide\//i, '');
        if (slug) {
          setActiveArticleSlug(slug);
          setCurrentPage('blog-article');
          return;
        }
      }

      // Default Homepage
      setCurrentPage('home');
    };

    handleUrlRouting();
    window.addEventListener('hashchange', handleUrlRouting);
    window.addEventListener('popstate', handleUrlRouting);
    return () => {
      window.removeEventListener('hashchange', handleUrlRouting);
      window.removeEventListener('popstate', handleUrlRouting);
    };
  }, []);

  const handleNavigate = (page: string, slugOrId?: string) => {
    let targetPath = '/';

    if (page === 'service-detail' && slugOrId) {
      setSelectedServiceId(slugOrId);
      setCurrentPage('service-detail');
      targetPath = `/services/${slugOrId}`;
    } else if (page === 'blog-article' && slugOrId) {
      setActiveArticleSlug(slugOrId);
      setCurrentPage('blog-article');
      targetPath = `/guides/${slugOrId}`;
    } else if (page === 'services') {
      setCurrentPage('services');
      targetPath = '/services';
    } else if (page === 'branches') {
      if (slugOrId) {
        setSelectedBranchSlug(slugOrId);
        targetPath = `/branches/${slugOrId}`;
      } else {
        setSelectedBranchSlug(null);
        targetPath = '/branches';
      }
      setCurrentPage('branches');
    } else if (page === 'reviews') {
      setCurrentPage('reviews');
      targetPath = '/reviews';
    } else if (page === 'company') {
      setCurrentPage('company');
      targetPath = '/company';
    } else if (page === 'blog') {
      setCurrentPage('blog');
      targetPath = '/guides';
    } else if (page === 'faq') {
      setCurrentPage('faq');
      targetPath = '/faq';
    } else if (page === 'privacy') {
      setCurrentPage('privacy');
      targetPath = '/privacy-policy';
    } else {
      setCurrentPage('home');
      targetPath = '/';
    }

    try {
      window.history.pushState(null, '', targetPath);
    } catch {
      // ignore in environments without history api
    }

    // Push virtual pageview to dataLayer for Google Tag Manager tracking
    if (typeof window !== 'undefined' && (window as any).dataLayer) {
      (window as any).dataLayer.push({
        event: 'virtual_page_view',
        page_path: targetPath,
        page_title: document.title
      });
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (currentPage === 'admin') {
    return <AdminWrapper onExitAdmin={() => handleNavigate('home')} />;
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-['Plus_Jakarta_Sans',sans-serif] overflow-x-hidden w-full">
      {/* Navigation Header */}
      <Header
        currentPage={currentPage}
        onNavigate={handleNavigate}
      />

      {/* Main Page Content */}
      <main className="flex-grow w-full max-w-full overflow-x-hidden">
        {currentPage === 'home' && (
          <HomePage
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onNavigate={handleNavigate}
            onSelectServiceDocs={(service) => setSelectedServiceDocsId(service.id)}
          />
        )}

        {currentPage === 'services' && (
          <ServicesPage
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onSelectServiceDocs={(service) => setSelectedServiceDocsId(service.id)}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'service-detail' && (
          <ServiceDetailPage
            serviceId={selectedServiceId}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'branches' && <BranchesPage selectedBranchSlug={selectedBranchSlug} />}

        {currentPage === 'reviews' && <ReviewsPage onNavigate={handleNavigate} />}

        {currentPage === 'company' && <CompanyPage />}

        {currentPage === 'blog' && <BlogPage onNavigate={handleNavigate} />}

        {currentPage === 'blog-article' && (
          <ArticlePage
            articleSlug={activeArticleSlug}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'faq' && <FaqPage />}

        {currentPage === 'privacy' && <PrivacyPolicyPage onNavigate={handleNavigate} />}
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Floating WhatsApp Quick Contact Button */}
      <FloatingWhatsApp />

      {/* Document Checklist Modal */}
      <DocumentChecklistModal
        service={activeServiceDocs}
        onClose={() => setSelectedServiceDocsId(null)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  );
}
