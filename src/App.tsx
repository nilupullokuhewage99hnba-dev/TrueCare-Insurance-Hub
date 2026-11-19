import React, { useCallback, useEffect, useState } from 'react';
import {
  Calendar,
  Gift,
  Home,
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
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0F172A]">
      {/* Desktop Top Bar (Strict 3-Zone Contract) & Compact Mobile Header (48px) */}
      <header className="sticky top-0 z-30 h-12 md:h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-6xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between gap-8">
          {/* Zone 1: Single-line Brand Emblem + Wordmark */}
          <button
            type="button"
            onClick={() => handleNavigate('home')}
            aria-label="TrueCare Home"
            className="whitespace-nowrap shrink-0 cursor-pointer"
          >
            <TrueCareLogo variant="header" />
          </button>

          {/* Zone 2: 5 Single-line navigation links (Desktop) */}
          <nav
            aria-label="Primary navigation"
            className="hidden md:flex items-center gap-6 text-sm font-medium"
          >
            {NAV_ITEMS.map((item) => {
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavigate(item.id)}
                  className={`py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer border-b-2 ${
                    active
                      ? 'text-[#0B2545] border-[#B4832D]'
                      : 'text-slate-600 border-transparent hover:text-[#0B2545]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Single Primary Call Action (071 941 4247) */}
          <a
            href={ADVISOR.phoneTel}
            className="inline-flex items-center gap-1.5 min-h-[36px] md:min-h-[40px] px-3.5 md:px-4 rounded-xl bg-[#0B2545] text-white text-xs font-medium hover:bg-[#133863] transition-colors whitespace-nowrap shrink-0"
          >
            <Phone className="w-3.5 h-3.5" />
            <span className="tabular-nums">{ADVISOR.phoneDisplay}</span>
          </a>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 md:py-10 pb-24 md:pb-14">
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

      {/* Clean Quiet Footer (Desktop) */}
      <footer className="hidden md:block border-t border-slate-200/80 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            {ADVISOR.appName} · {advisor.role}
          </p>
          <div className="flex items-center gap-4">
            <a href={ADVISOR.phoneTel} className="font-mono-tabular hover:text-[#0B2545]">
              Call: {ADVISOR.phoneDisplay}
            </a>
            <span aria-hidden="true">·</span>
            <span className="font-mono-tabular">WhatsApp: {ADVISOR.whatsappDisplay}</span>
          </div>
        </div>
      </footer>

      {/* Mobile Fixed Bottom Thumb Navigation Bar (60px height — keeps aggregate sticky <= 13%) */}
      <nav
        aria-label="Mobile bottom navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 pb-safe"
      >
        <div className="grid grid-cols-5 items-center h-[60px]">
          {NAV_ITEMS.map(({ id, shortLabel, Icon }) => {
            const active = activeTab === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => handleNavigate(id)}
                className={`flex flex-col items-center justify-center min-h-[48px] transition-colors cursor-pointer ${
                  active ? 'text-[#0B2545]' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon
                  className={`w-[21px] h-[21px] ${
                    active ? 'text-[#0B2545] stroke-[2.25]' : 'stroke-[1.75]'
                  }`}
                />
                <span
                  className={`text-[10px] mt-1 tracking-tight whitespace-nowrap ${
                    active ? 'font-semibold text-[#0B2545]' : 'font-medium'
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
