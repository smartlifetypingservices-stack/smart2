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

export function renderPage(route: string): { html: string; title: string; description: string; canonical: string } {
  let currentPage = 'home';
  let subId = '';
  let branchSlug: string | null = null;

  if (route === '/' || route === '') {
    currentPage = 'home';
  } else if (route === '/services') {
    currentPage = 'services';
  } else if (route.startsWith('/services/')) {
    currentPage = 'service-detail';
    subId = route.replace('/services/', '');
  } else if (route === '/branches') {
    currentPage = 'branches';
  } else if (route.startsWith('/branches/')) {
    currentPage = 'branches';
    branchSlug = route.replace('/branches/', '');
  } else if (route === '/reviews') {
    currentPage = 'reviews';
  } else if (route === '/company') {
    currentPage = 'company';
  } else if (route === '/guides') {
    currentPage = 'blog';
  } else if (route.startsWith('/guides/')) {
    currentPage = 'blog-article';
    subId = route.replace('/guides/', '');
  } else if (route === '/faq') {
    currentPage = 'faq';
  } else if (route === '/privacy-policy') {
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
    canonical: seoConfig.canonicalUrl
  };
}
