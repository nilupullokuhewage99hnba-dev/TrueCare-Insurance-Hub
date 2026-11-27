import React, { useCallback, useEffect, useState } from 'react';
import {
  Calendar,
  Gift,
  Home,
  MessageCircle,
  Phone,
  Shield,
  UserPlus,
} from 'lucide-react';
import {
  ActiveTab,
  AdvisorProfileData,
  EventOffer,
  Product,
} from './types';
import {
  ADVISOR,
  buildWhatsAppUrl,
  DEFAULT_ADVISOR_PHOTO,
  loadInitialDataset,
  STARTER_PRODUCTS,
} from './data/advisorData';
import { fetchPublicData } from './services/truecareApi';
import { HomeView } from './components/HomeView';
import { ProductsView } from './components/ProductsView';
import { EventsOffersView } from './components/EventsOffersView';
import { ReferFriendView } from './components/ReferFriendView';
import { RewardsView } from './components/RewardsView';
import { EmailAdvisorModal } from './components/EmailAdvisorModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import { TrueCareLogo } from './components/TrueCareLogo';

const NAV_ITEMS: Array<{
  id: ActiveTab;
  label: string;
  shortLabel: string;
  Icon: React.FC<{ className?: string }>;
}> = [
  { id: 'home', label: 'Home', shortLabel: 'Home', Icon: Home },
  { id: 'products', label: 'Products', shortLabel: 'Plans', Icon: Shield },
  { id: 'events', label: 'Events & Offers', shortLabel: 'Offers', Icon: Calendar },
  { id: 'refer', label: 'Refer a Friend', shortLabel: 'Refer', Icon: UserPlus },
  { id: 'rewards', label: 'Rewards', shortLabel: 'Rewards', Icon: Gift },
];

const SAVED_LOCAL_PHOTO_KEY = 'truecare_advisor_local_photo';

const DEFAULT_ADVISOR_PROFILE: AdvisorProfileData = {
  fullName: ADVISOR.fullName,
  displayName: ADVISOR.displayName,
  role: `${ADVISOR.role} — ${ADVISOR.company}`,
  company: ADVISOR.company,
  bio: ADVISOR.bio,
  phoneRaw: ADVISOR.phoneRaw,
  phoneDisplay: ADVISOR.phoneDisplay,
  phoneTel: ADVISOR.phoneTel,
  whatsappRaw: ADVISOR.whatsappRaw,
  whatsappDisplay: ADVISOR.whatsappDisplay,
  whatsappNumber: ADVISOR.whatsappNumber,
  email: ADVISOR.email,
  photoUrl: DEFAULT_ADVISOR_PHOTO,
};

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [preselectedReferProduct, setPreselectedReferProduct] = useState<string | undefined>(
    undefined
  );
  const [rewardsLookupPhone, setRewardsLookupPhone] = useState<string>('');

  const [advisor, setAdvisor] = useState<AdvisorProfileData>(DEFAULT_ADVISOR_PROFILE);
  const [products, setProducts] = useState<Product[]>(STARTER_PRODUCTS);
  const [eventsOffers, setEventsOffers] = useState<EventOffer[]>([]);
  const [isLoadingPublic, setIsLoadingPublic] = useState<boolean>(true);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<string | null>(null);

  const [localPhotoOverride, setLocalPhotoOverride] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      return window.localStorage.getItem(SAVED_LOCAL_PHOTO_KEY);
    } catch {
      return null;
    }
  });

  const [emailModal, setEmailModal] = useState<{
    open: boolean;
    subject?: string;
    body?: string;
  }>({ open: false });

  const loadLivePublicData = useCallback(async () => {
    setIsLoadingPublic(true);
    try {
      const data = await fetchPublicData();
      if (data.products.length > 0) {
        setProducts(data.products);
      }
      setEventsOffers(data.eventsOffers);
      setAdvisor(data.advisor);
      setLastUpdatedAt(data.fetchedAt);
    } catch (err) {
      console.warn('Could not fetch live public data, falling back to local snapshot:', err);
      const fallback = await loadInitialDataset();
      setProducts(fallback.products);
    } finally {
      setIsLoadingPublic(false);
    }
  }, []);

  useEffect(() => {
    loadLivePublicData();
  }, [loadLivePublicData]);

  const advisorPhotoUrl = localPhotoOverride || advisor.photoUrl || DEFAULT_ADVISOR_PHOTO;

  const livePhoneTel = advisor.phoneTel || ADVISOR.phoneTel;
  const livePhoneDisplay = advisor.phoneDisplay || ADVISOR.phoneDisplay;
  const liveWhatsappNumber = (advisor.whatsappNumber || ADVISOR.whatsappNumber || '').replace(/\D/g, '');
  const liveWhatsappDisplay = advisor.whatsappDisplay || ADVISOR.whatsappDisplay;

  const floatingWhatsAppUrl = liveWhatsappNumber
    ? `https://wa.me/${liveWhatsappNumber}?text=${encodeURIComponent(
        'Hello Nilupul, I am browsing the TrueCare app and would like advice on HNB Life plans.'
      )}`
    : buildWhatsAppUrl(
        'Hello Nilupul, I am browsing the TrueCare app and would like advice on HNB Life plans.'
      );

  const handleUpdateLocalPhoto = (photoValue: string) => {
    setLocalPhotoOverride(photoValue);
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(SAVED_LOCAL_PHOTO_KEY, photoValue);
      } catch {
        // Ignore storage quota errors safely
      }
    }
  };

  const handleResetPhoto = () => {
    setLocalPhotoOverride(null);
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(SAVED_LOCAL_PHOTO_KEY);
    }
  };

  const handleNavigate = (tab: ActiveTab) => {
    setActiveTab(tab);
    if (tab !== 'products') {
      setSelectedProduct(null);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenProductDetail = (product: Product) => {
    setSelectedProduct(product);
    setActiveTab('products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReferProduct = (productName: string) => {
    setPreselectedReferProduct(productName);
    setSelectedProduct(null);
    setActiveTab('refer');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenEmail = (subject?: string, body?: string) => {
    setEmailModal({ open: true, subject, body });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#F8FAFC] via-[#F8FAFC] to-[#F1F5F9] text-[#0F172A]">
      {/* Global Smooth Tab Transition Animation */}
      <style>{`
        @keyframes tcPageEnter {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .tc-page-enter {
          animation: tcPageEnter 0.32s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
      `}</style>

      {/* Top Accent Bar */}
      <div className="h-[3px] w-full bg-gradient-to-r from-[#0B2545] via-[#D4A84F] to-[#0B2545]" />

      {/* Desktop Top Bar & Compact Mobile Header */}
      <header className="sticky top-0 z-30 h-14 md:h-16 bg-white/90 backdrop-blur-lg border-b border-slate-200/80 shadow-[0_2px_12px_-6px_rgba(11,37,69,0.08)]">
        <div className="max-w-6xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between gap-6">
          {/* Zone 1: Brand Emblem + Wordmark */}
          <button
            type="button"
            onClick={() => handleNavigate('home')}
            aria-label="TrueCare Home"
            className="whitespace-nowrap shrink-0 cursor-pointer active:scale-[0.98] transition-transform"
          >
            <TrueCareLogo variant="header" />
          </button>

          {/* Zone 2: Desktop Navigation Pills */}
          <nav
            aria-label="Primary navigation"
            className="hidden md:flex items-center gap-1.5 text-sm font-medium"
          >
            {NAV_ITEMS.map((item) => {
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavigate(item.id)}
                  className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'bg-[#0B2545] text-white shadow-xs'
                      : 'text-slate-600 hover:text-[#0B2545] hover:bg-slate-100/80'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary Call Action */}
          <a
            href={livePhoneTel}
            className="inline-flex items-center gap-1.5 min-h-[38px] md:min-h-[40px] px-3.5 md:px-4 rounded-xl bg-gradient-to-r from-[#0B2545] to-[#163B6B] text-white text-xs font-semibold shadow-xs hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] transition-all whitespace-nowrap shrink-0"
          >
            <Phone className="w-3.5 h-3.5 text-[#E8C574]" />
            <span className="tabular-nums">{livePhoneDisplay}</span>
          </a>
        </div>
      </header>

      {/* Main Content Area with Smooth Tab Transition */}
      <main
        key={activeTab}
        className="tc-page-enter flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 md:py-10 pb-28 md:pb-16"
      >
        {activeTab === 'home' && (
          <HomeView
            advisor={advisor}
            products={products}
            eventsOffers={eventsOffers}
            advisorPhotoUrl={advisorPhotoUrl}
            hasCustomLocalPhoto={!!localPhotoOverride}
            isLoadingData={isLoadingPublic}
            lastUpdatedAt={lastUpdatedAt}
            onRefreshData={loadLivePublicData}
            onUpdateLocalPhoto={handleUpdateLocalPhoto}
            onResetPhoto={handleResetPhoto}
            onNavigate={handleNavigate}
            onSelectProduct={handleOpenProductDetail}
            onOpenEmail={handleOpenEmail}
          />
        )}

        {activeTab === 'products' && (
          <ProductsView
            products={products}
            selectedProduct={selectedProduct}
            onSelectProduct={setSelectedProduct}
            onOpenEmail={handleOpenEmail}
            onReferProduct={handleReferProduct}
          />
        )}

        {activeTab === 'events' && (
          <EventsOffersView
            eventsOffers={eventsOffers}
            onOpenEmail={handleOpenEmail}
          />
        )}

        {activeTab === 'refer' && (
          <ReferFriendView
            products={products}
            preselectedProduct={preselectedReferProduct}
            onCheckRewardsForPhone={(phone) => {
              setRewardsLookupPhone(phone);
              handleNavigate('rewards');
            }}
          />
        )}

        {activeTab === 'rewards' && (
          <RewardsView
            initialLookupPhone={rewardsLookupPhone}
            onNavigateToRefer={() => handleNavigate('refer')}
            onOpenEmail={handleOpenEmail}
          />
        )}
      </main>

      {/* Floating WhatsApp Quick-Chat Button */}
      <a
        href={floatingWhatsAppUrl}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
        title={`WhatsApp ${liveWhatsappDisplay}`}
        className="fixed right-4 bottom-[78px] md:bottom-6 md:right-6 z-40 inline-flex items-center gap-2 h-12 px-4 rounded-full bg-gradient-to-r from-[#059669] to-[#0F766E] text-white text-xs font-semibold shadow-[0_8px_24px_-4px_rgba(5,150,105,0.55)] hover:shadow-[0_12px_28px_-4px_rgba(5,150,105,0.65)] hover:-translate-y-0.5 active:scale-95 transition-all"
      >
        <MessageCircle className="w-5 h-5 shrink-0" />
        <span className="hidden sm:inline">WhatsApp Advisor</span>
      </a>

      {/* Clean Quiet Footer (Desktop) */}
      <footer className="hidden md:block border-t border-slate-200/80 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
          <p className="font-medium text-slate-600">
            {ADVISOR.appName} · {advisor.role}
          </p>
          <div className="flex items-center gap-4">
            <a href={livePhoneTel} className="font-mono-tabular hover:text-[#0B2545] transition-colors">
              Call: {livePhoneDisplay}
            </a>
            <span aria-hidden="true">·</span>
            <a
              href={floatingWhatsAppUrl}
              target="_blank"
              rel="noreferrer"
              className="font-mono-tabular hover:text-emerald-700 transition-colors"
            >
              WhatsApp: {liveWhatsappDisplay}
            </a>
          </div>
        </div>
      </footer>

      {/* Mobile Fixed Bottom Thumb Navigation Bar (Modern Pill Style) */}
      <nav
        aria-label="Mobile bottom navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/90 shadow-[0_-4px_20px_-6px_rgba(11,37,69,0.1)] pb-safe"
      >
        <div className="grid grid-cols-5 items-center h-[64px] px-1.5">
          {NAV_ITEMS.map(({ id, shortLabel, Icon }) => {
            const active = activeTab === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => handleNavigate(id)}
                className="flex flex-col items-center justify-center min-h-[48px] cursor-pointer active:scale-95 transition-transform"
              >
                <span
                  className={`flex items-center justify-center w-11 h-7 rounded-full transition-all duration-200 ${
                    active
                      ? 'bg-[#0B2545] text-[#F3D58D] shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Icon
                    className={`w-[18px] h-[18px] ${
                      active ? 'stroke-[2.25]' : 'stroke-[1.75]'
                    }`}
                  />
                </span>
                <span
                  className={`text-[10px] mt-1 tracking-tight whitespace-nowrap transition-colors ${
                    active ? 'font-bold text-[#0B2545]' : 'font-medium text-slate-500'
                  }`}
                >
                  {shortLabel}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Modals & PWA Offline Indicator */}
      <EmailAdvisorModal
        open={emailModal.open}
        advisorEmail={advisor.email}
        initialSubject={emailModal.subject}
        initialBody={emailModal.body}
        onClose={() => setEmailModal({ open: false })}
      />

      <OfflineIndicator />
    </div>
  );
}
