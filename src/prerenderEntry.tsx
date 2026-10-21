import React from 'react';
import { renderToString } from 'react-dom/server';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { ServicesPage } from './pages/ServicesPage';
import { ServiceDetailPage } from './pages/ServiceDetailPage';
import { BranchesPage } from './pages/BranchesPage';
import { ReviewsPage } from './pages/ReviewsPage';
import { CompanyPage } from './pages/CompanyPage';
import { BlogPage } from './pages/BlogPage';
import { ArticlePage } from './pages/ArticlePage';
import { FaqPage } from './pages/FaqPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { getSeoConfigForPage } from './utils/seoManager';

export interface PrerenderResult {
  html: string;
  title: string;
  description: string;
  canonical: string;
  ogTitle: string;
  ogDescription: string;
  ogUrl: string;
  twitterTitle: string;
  twitterDescription: string;
  ogImage: string;
  twitterImage: string;
}

export function renderPage(route: string): PrerenderResult {
  let currentPage = 'home';
  let subId = '';
  let branchSlug: string | null = null;

  // Normalize route by stripping trailing slash for page component matching
  const cleanRoute = route.replace(/\/+$/, '') || '/';

  if (cleanRoute === '/' || cleanRoute === '') {
    currentPage = 'home';
  } else if (cleanRoute === '/services') {
    currentPage = 'services';
  } else if (cleanRoute.startsWith('/services/')) {
    currentPage = 'service-detail';
    subId = cleanRoute.replace('/services/', '');
  } else if (cleanRoute === '/branches') {
    currentPage = 'branches';
  } else if (cleanRoute.startsWith('/branches/')) {
    currentPage = 'branches';
    branchSlug = cleanRoute.replace('/branches/', '');
  } else if (cleanRoute === '/reviews') {
    currentPage = 'reviews';
  } else if (cleanRoute === '/company') {
    currentPage = 'company';
  } else if (cleanRoute === '/guides') {
    currentPage = 'blog';
  } else if (cleanRoute.startsWith('/guides/')) {
    currentPage = 'blog-article';
    subId = cleanRoute.replace('/guides/', '');
  } else if (cleanRoute === '/faq') {
    currentPage = 'faq';
  } else if (cleanRoute === '/privacy-policy') {
    currentPage = 'privacy';
  }

  const seoKey = (currentPage === 'branches' && branchSlug)
    ? (branchSlug === 'abu-shagara' ? 'branch-abu-shagara' : (branchSlug === 'al-majaz' ? 'branch-al-majaz' : 'branches'))
    : currentPage;

  const seoConfig = getSeoConfigForPage(seoKey, currentPage === 'service-detail' ? subId : subId);

  const renderedContent = renderToString(
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-['Plus_Jakarta_Sans',sans-serif] overflow-x-hidden w-full">
      <Header currentPage={currentPage} onNavigate={() => {}} />
      <main className="flex-grow w-full max-w-full overflow-x-hidden">
        {currentPage === 'home' && (
          <HomePage
            searchQuery=""
            setSearchQuery={() => {}}
            onNavigate={() => {}}
            onSelectServiceDocs={() => {}}
          />
        )}
        {currentPage === 'services' && (
          <ServicesPage
            searchQuery=""
            setSearchQuery={() => {}}
            onSelectServiceDocs={() => {}}
            onNavigate={() => {}}
          />
        )}
        {currentPage === 'service-detail' && (
          <ServiceDetailPage serviceId={subId || 'family-visa'} onNavigate={() => {}} />
        )}
        {currentPage === 'branches' && (
          <BranchesPage selectedBranchSlug={branchSlug} />
        )}
        {currentPage === 'reviews' && (
          <ReviewsPage onNavigate={() => {}} />
        )}
        {currentPage === 'company' && (
          <CompanyPage />
        )}
        {currentPage === 'blog' && (
          <BlogPage onNavigate={() => {}} />
        )}
        {currentPage === 'blog-article' && (
          <ArticlePage articleSlug={subId || 'sharjah-family-visa-renewal-guide'} onNavigate={() => {}} />
        )}
        {currentPage === 'faq' && (
          <FaqPage />
        )}
        {currentPage === 'privacy' && (
          <PrivacyPolicyPage onNavigate={() => {}} />
        )}
      </main>
      <Footer onNavigate={() => {}} />
    </div>
  );

  return {
    html: renderedContent,
    title: seoConfig.title,
    description: seoConfig.description,
    canonical: seoConfig.canonicalUrl,
    ogTitle: seoConfig.title,
    ogDescription: seoConfig.description,
    ogUrl: seoConfig.canonicalUrl,
    twitterTitle: seoConfig.title,
    twitterDescription: seoConfig.description,
    ogImage: seoConfig.ogImage,
    twitterImage: seoConfig.twitterImage
  };
}
