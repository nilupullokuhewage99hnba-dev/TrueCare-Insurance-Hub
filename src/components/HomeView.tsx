import React, { useRef, useState } from 'react';
import {
  ArrowRight,
  Award,
  Calendar,
  Camera,
  CheckCircle2,
  Gift,
  Mail,
  MessageCircle,
  Phone,
  RefreshCw,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Upload,
  UserPlus,
  X,
} from 'lucide-react';
import { ActiveTab, AdvisorProfileData, EventOffer, Product } from '../types';
import { ADVISOR, buildWhatsAppUrl, DEFAULT_ADVISOR_PHOTO } from '../data/advisorData';
import { PWAInstallButton } from './PWAInstallButton';
import { TrueCareLogo } from './TrueCareLogo';

interface HomeViewProps {
  advisor: AdvisorProfileData;
  products: Product[];
  eventsOffers: EventOffer[];
  advisorPhotoUrl: string;
  hasCustomLocalPhoto: boolean;
  isLoadingData: boolean;
  lastUpdatedAt: string | null;
  onRefreshData: () => void;
  onUpdateLocalPhoto: (dataUrl: string) => void;
  onResetPhoto: () => void;
  onNavigate: (tab: ActiveTab) => void;
  onSelectProduct: (product: Product) => void;
  onOpenEmail: (subject?: string, body?: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  advisor,
  products,
  eventsOffers,
  advisorPhotoUrl,
  hasCustomLocalPhoto,
  isLoadingData,
  lastUpdatedAt,
  onRefreshData,
  onUpdateLocalPhoto,
  onResetPhoto,
  onNavigate,
  onSelectProduct,
  onOpenEmail,
}) => {
  const featuredProduct = products[0];
  const featuredOffer = eventsOffers[0];

  const [imgFailed, setImgFailed] = useState(false);
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Pulls live WhatsApp & Phone from Google Sheet first, falls back to advisorData
  const liveWhatsappNumber = (advisor.whatsappNumber || ADVISOR.whatsappNumber || '').replace(/\D/g, '');
  const liveWhatsappDisplay = advisor.whatsappDisplay || ADVISOR.whatsappDisplay;
  const liveWhatsappRaw = advisor.whatsappRaw || ADVISOR.whatsappRaw;
  const livePhoneTel = advisor.phoneTel || ADVISOR.phoneTel;
  const livePhoneDisplay = advisor.phoneDisplay || ADVISOR.phoneDisplay;
  const livePhoneRaw = advisor.phoneRaw || ADVISOR.phoneRaw;

  const whatsappMessage =
    'Hello Nilupul, I am reaching out via the TrueCare app and would like guidance on HNB Life protection plans.';

  const directWhatsAppUrl = liveWhatsappNumber
    ? `https://wa.me/${liveWhatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`
    : buildWhatsAppUrl(whatsappMessage);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhotoError(null);
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setPhotoError('Please select a valid image file (JPG, PNG, or WebP).');
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      setPhotoError('Please select an image smaller than 4 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImgFailed(false);
        onUpdateLocalPhoto(reader.result);
        setPhotoModalOpen(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const displayedPhoto = imgFailed ? DEFAULT_ADVISOR_PHOTO : advisorPhotoUrl || DEFAULT_ADVISOR_PHOTO;

  return (
    <>
      {/* Lightweight Custom Animations */}
      <style>{`
        @keyframes tcFadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes tcFloatSlow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(2deg); }
        }
        @keyframes tcSoftPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.35); }
          50% { box-shadow: 0 0 0 8px rgba(16, 185, 129, 0); }
        }
        .tc-animate-1 { animation: tcFadeUp 0.55s cubic-bezier(0.16, 1, 0.3, 1) both; }
        .tc-animate-2 { animation: tcFadeUp 0.55s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both; }
        .tc-animate-3 { animation: tcFadeUp 0.55s cubic-bezier(0.16, 1, 0.3, 1) 0.18s both; }
        .tc-animate-4 { animation: tcFadeUp 0.55s cubic-bezier(0.16, 1, 0.3, 1) 0.26s both; }
        .tc-float { animation: tcFloatSlow 7s ease-in-out infinite; }
        .tc-wa-pulse { animation: tcSoftPulse 2.6s ease-in-out infinite; }
      `}</style>

      <div className="space-y-8 md:space-y-10">
        {/* Premium Hero & Advisor Profile Split */}
        <section className="tc-animate-1 rounded-3xl bg-white border border-slate-200/80 overflow-hidden shadow-[0_12px_40px_-15px_rgba(11,37,69,0.12)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            {/* Left: Brand Lockup, Advisor Identity & One-Tap Contact */}
            <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between bg-gradient-to-br from-white via-white to-amber-50/30">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <TrueCareLogo variant="hero" />
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-[11px] font-semibold text-[#9A6B1C] tracking-wide">
                    <Sparkles className="w-3.5 h-3.5 text-[#D4A84F]" />
                    <span>Trusted Wealth &amp; Life Advisory</span>
                  </span>
                </div>

                <p className="mt-6 text-xs font-semibold uppercase text-[#B4832D] tracking-wider">
                  {advisor.role}
                </p>
                <h1 className="mt-1.5 font-display text-3xl sm:text-4xl lg:text-[2.65rem] font-bold tracking-tight text-[#0B2545] leading-[1.12]">
                  {advisor.fullName}
                </h1>
                <p className="mt-4 text-[15px] sm:text-base text-slate-600 leading-relaxed max-w-2xl">
                  {advisor.bio}
                </p>

                {/* Trust Highlights Strip */}
                <div className="mt-5 flex flex-wrap items-center gap-2">
                  {[
                    'Cashless Hospital Cover',
                    'Tax-Free Investment',
                    'Child Education & Retirement',
                  ].map((badge) => (
                    <span
                      key={badge}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100/90 text-xs font-medium text-slate-700 border border-slate-200/60"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{badge}</span>
                    </span>
                  ))}
                </div>

                {/* One-Tap Contact Controls */}
                <div className="mt-7 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <a
                    href={livePhoneTel}
                    className="inline-flex items-center justify-center gap-2 min-h-[48px] px-4 py-3 rounded-xl bg-gradient-to-r from-[#0B2545] to-[#163B6B] text-white text-sm font-semibold shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] transition-all whitespace-nowrap"
                  >
                    <Phone className="w-4 h-4 shrink-0 text-[#E8C574]" />
                    <span className="tabular-nums">Call {livePhoneDisplay}</span>
                  </a>

                  <a
                    href={directWhatsAppUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="tc-wa-pulse inline-flex items-center justify-center gap-2 min-h-[48px] px-4 py-3 rounded-xl bg-gradient-to-r from-[#059669] to-[#0F766E] text-white text-sm font-semibold shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] transition-all whitespace-nowrap"
                  >
                    <MessageCircle className="w-4 h-4 shrink-0" />
                    <span className="tabular-nums">WhatsApp {liveWhatsappDisplay}</span>
                  </a>

                  <button
                    type="button"
                    onClick={() =>
                      onOpenEmail(
                        'Personal Financial Consultation — TrueCare',
                        'Hello Nilupul,\n\nI would like to discuss life insurance and family protection options with you.\n\nBest regards,'
                      )
                    }
                    className="inline-flex items-center justify-center gap-2 min-h-[48px] px-4 py-3 rounded-xl border border-slate-200 bg-white text-[#0B2545] text-sm font-semibold hover:border-[#D4A84F] hover:bg-amber-50/40 hover:-translate-y-0.5 active:scale-[0.98] transition-all whitespace-nowrap cursor-pointer"
                  >
                    <Mail className="w-4 h-4 shrink-0 text-[#B4832D]" />
                    <span>Email Advisor</span>
                  </button>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs text-slate-500 flex flex-wrap items-center gap-x-2.5 gap-y-1">
                  <span>
                    Call:{' '}
                    <a
                      href={livePhoneTel}
                      className="font-mono-tabular font-medium text-slate-700 hover:text-[#0B2545]"
                    >
                      {livePhoneRaw}
                    </a>
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>
                    WhatsApp:{' '}
                    <a
                      href={directWhatsAppUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono-tabular font-medium text-slate-700 hover:text-emerald-700"
                    >
                      {liveWhatsappRaw}
                    </a>
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono-tabular text-slate-700">{advisor.email}</span>
                </div>
                <PWAInstallButton variant="compact" />
              </div>
            </div>

            {/* Right: Premium Deep Navy & Gold Advisor Profile Plate */}
            <div className="lg:col-span-5 bg-gradient-to-br from-[#071930] via-[#0B2545] to-[#133863] text-white p-6 sm:p-8 lg:p-10 flex flex-col justify-between relative overflow-hidden">
              {/* Ambient Gold Glow & Floating Shield Graphic */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-20 -right-20 w-64 h-64 rounded-full bg-[#D4A84F]/15 blur-3xl"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-24 -left-16 w-56 h-56 rounded-full bg-emerald-400/10 blur-3xl"
              />
              <svg
                className="tc-float absolute -right-10 -top-10 w-64 h-64 text-[#E8C574]/[0.08] pointer-events-none"
                viewBox="0 0 200 200"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M100 12L178 44V104C178 152 144 184 100 196C56 184 22 152 22 104V44L100 12Z"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M100 34L158 58V104C158 140 132 165 100 175C68 165 42 140 42 104V58L100 34Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>

              {/* Professional Advisor Photo Frame */}
              <div className="relative z-10 flex items-center gap-4">
                <div className="relative shrink-0">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-[#133863] ring-2 ring-[#E8C574]/80 ring-offset-2 ring-offset-[#0B2545] shadow-xl">
                    <img
                      src={displayedPhoto}
                      alt="TrueCare — Nilupul Lokuhewage Advisor Profile"
                      referrerPolicy="no-referrer"
                      onError={() => setImgFailed(true)}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setPhotoError(null);
                      setPhotoModalOpen(true);
                    }}
                    aria-label="Update advisor profile photo"
                    title="Update profile photo"
                    className="absolute -bottom-2 -right-2 min-h-[36px] min-w-[36px] rounded-xl bg-white text-[#0B2545] shadow-md border border-slate-200 flex items-center justify-center hover:bg-amber-50 hover:scale-105 transition-all cursor-pointer"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                </div>

                <div className="min-w-0">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/10 border border-[#E8C574]/30 text-[11px] text-[#F3D58D] font-medium">
                    <Award className="w-3 h-3" />
                    <span>TrueCare Advisory Desk</span>
                  </span>
                  <p className="mt-1.5 text-lg font-bold text-white leading-snug">
                    {advisor.displayName}
                  </p>
                  <p className="text-xs text-slate-300 mt-0.5">
                    {advisor.company} · Personal Protection
                  </p>
                </div>
              </div>

              <div className="relative z-10 mt-8 space-y-3.5">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#E8C574]/90">
                  How I work with every client
                </p>
                <ul className="space-y-3">
                  {ADVISOR.servicePromise.map((promise, index) => (
                    <li
                      key={promise}
                      className="flex items-start gap-3 text-sm text-slate-100 leading-snug bg-white/[0.04] border border-white/[0.06] rounded-xl px-3.5 py-2.5 backdrop-blur-xs"
                    >
                      <span className="font-mono-tabular text-xs font-bold text-[#F3D58D] pt-0.5 shrink-0">
                        0{index + 1}
                      </span>
                      <span>{promise}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="relative z-10 mt-8 pt-5 border-t border-white/10 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-[11px] uppercase tracking-wider text-slate-400">
                    TrueCare Live Catalog
                  </p>
                  <p className="text-xs font-medium text-white truncate tabular-nums mt-0.5">
                    {isLoadingData
                      ? 'Updating plans & offers…'
                      : lastUpdatedAt
                      ? `Updated at ${lastUpdatedAt}`
                      : 'Ready'}
                  </p>
                </div>
                <button
                  type="button"
                  disabled={isLoadingData}
                  onClick={onRefreshData}
                  className="inline-flex items-center gap-1.5 min-h-[40px] px-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-medium text-white transition-all active:scale-95 whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw
                    className={`w-3.5 h-3.5 text-[#E8C574] ${isLoadingData ? 'animate-spin' : ''}`}
                  />
                  <span>Refresh</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Destinations Strip (Staggered Entrance + Interactive Cards) */}
        <section
          aria-label="Quick navigation highlights"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {/* Highlight 1: Featured Plan */}
          {featuredProduct ? (
            <div className="tc-animate-2 group relative rounded-2xl bg-white border border-slate-200/80 p-6 flex flex-col justify-between shadow-xs hover:shadow-lg hover:border-[#D4A84F]/60 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#0B2545] to-[#D4A84F]" />
              <div>
                <div className="flex items-center justify-between text-xs">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-[#0B2545] font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#B4832D]" />
                    <span>Featured · {featuredProduct.category}</span>
                  </span>
                  <span className="font-mono-tabular text-slate-400">
                    {featuredProduct.productId}
                  </span>
                </div>
                <h2 className="mt-3.5 text-lg font-bold text-[#0F172A] group-hover:text-[#0B2545] transition-colors">
                  {featuredProduct.productName}
                </h2>
                <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
                  {featuredProduct.shortTagline}
                </p>
                <p className="mt-3 text-xs text-slate-500">
                  {featuredProduct.keyBenefits.slice(0, 3).join(' · ')}
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => onSelectProduct(featuredProduct)}
                  className="inline-flex items-center gap-1.5 min-h-[44px] text-sm font-semibold text-[#0B2545] hover:text-[#B4832D] transition-colors cursor-pointer"
                >
                  <span>View Detailed Benefits</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('products')}
                  className="min-h-[44px] text-xs font-medium text-slate-500 hover:text-[#0B2545] cursor-pointer"
                >
                  All {products.length} {products.length === 1 ? 'Plan' : 'Plans'}
                </button>
              </div>
            </div>
          ) : (
            <div className="tc-animate-2 group relative rounded-2xl bg-white border border-slate-200/80 p-6 flex flex-col justify-between shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#0B2545] to-[#D4A84F]" />
              <div>
                <p className="text-xs font-semibold text-[#B4832D]">HNB Life Portfolio</p>
                <h2 className="mt-2.5 text-lg font-bold text-[#0F172A]">
                  Protection &amp; Education Plans
                </h2>
                <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
                  Explore life protection, child higher education, health cover, and savings solutions tailored for your family.
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => onNavigate('products')}
                  className="inline-flex items-center gap-1.5 min-h-[44px] text-sm font-semibold text-[#0B2545] hover:text-[#B4832D] transition-colors cursor-pointer"
                >
                  <span>Browse Plans</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          )}

          {/* Highlight 2: Upcoming Event / Offer */}
          <div className="tc-animate-3 group relative rounded-2xl bg-white border border-slate-200/80 p-6 flex flex-col justify-between shadow-xs hover:shadow-lg hover:border-emerald-300/80 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-600 to-teal-400" />
            {featuredOffer ? (
              <div>
                <div className="flex items-center justify-between text-xs">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 font-semibold">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                    <span>
                      {featuredOffer.type} · {featuredOffer.status}
                    </span>
                  </span>
                </div>
                <h2 className="mt-3.5 text-lg font-bold text-[#0F172A]">
                  {featuredOffer.title}
                </h2>
                <p className="mt-1.5 text-sm text-slate-600 leading-relaxed line-clamp-3">
                  {featuredOffer.summary}
                </p>
                <p className="mt-3 text-xs font-semibold text-[#0F766E]">
                  {featuredOffer.highlight}
                </p>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between text-xs">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 font-semibold">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Events &amp; Special Offers</span>
                  </span>
                </div>
                <h2 className="mt-3.5 text-lg font-bold text-[#0F172A]">
                  Client Clinics &amp; Seasonal Offers
                </h2>
                <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
                  Check upcoming financial planning sessions, complimentary policy reviews, and exclusive client programs.
                </p>
              </div>
            )}
            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => onNavigate('events')}
                className="inline-flex items-center gap-1.5 min-h-[44px] text-sm font-semibold text-[#0B2545] hover:text-emerald-700 transition-colors cursor-pointer"
              >
                <span>View Events &amp; Offers</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <span className="text-xs font-medium text-slate-500 tabular-nums">
                {eventsOffers.length} Active
              </span>
            </div>
          </div>

          {/* Highlight 3: Refer & Earn Rewards */}
          <div className="tc-animate-4 group relative rounded-2xl bg-gradient-to-br from-white to-amber-50/40 border border-slate-200/80 p-6 flex flex-col justify-between shadow-xs hover:shadow-lg hover:border-[#D4A84F]/70 hover:-translate-y-1 transition-all duration-300 md:col-span-2 lg:col-span-1 overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#B4832D] to-[#F59E0B]" />
            <div>
              <div className="flex items-center justify-between text-xs">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-[#9A6B1C] font-semibold border border-amber-200/60">
                  <Gift className="w-3.5 h-3.5 text-[#D4A84F]" />
                  <span>Referral Program · Vouchers</span>
                </span>
              </div>
              <h2 className="mt-3.5 text-lg font-bold text-[#0F172A]">
                Refer a Friend &amp; Earn Gift Vouchers
              </h2>
              <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
                Introduce a family member or colleague to Nilupul. Earn loyalty points, LKR credits, and gift vouchers when their policy activates.
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-4">
              <button
                type="button"
                onClick={() => onNavigate('refer')}
                className="inline-flex items-center gap-1.5 min-h-[44px] text-sm font-semibold text-[#0B2545] hover:text-[#B4832D] transition-colors cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>Refer Now</span>
              </button>
              <span className="text-slate-300" aria-hidden="true">
                |
              </span>
              <button
                type="button"
                onClick={() => onNavigate('rewards')}
                className="inline-flex items-center gap-1.5 min-h-[44px] text-sm font-medium text-slate-600 hover:text-[#0B2545] transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-[#B4832D]" />
                <span>Check My Rewards</span>
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Advisor Photo Update Modal */}
      {photoModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/50 backdrop-blur-xs p-0 sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="photo-modal-title"
        >
          <div className="w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="w-10 h-1.5 bg-slate-200 rounded-full mx-auto mb-4 sm:hidden" />

            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 id="photo-modal-title" className="text-lg font-semibold text-[#0F172A]">
                  Advisor Profile Photo
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Loads automatically from your advisor profile, or upload a custom photo on this device.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPhotoModalOpen(false)}
                aria-label="Close photo settings"
                className="min-h-[44px] min-w-[44px] -mr-2 -mt-2 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-5 flex items-center gap-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <img
                src={displayedPhoto}
                alt="Current advisor profile preview"
                referrerPolicy="no-referrer"
                className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
              />
              <div className="min-w-0">
                <p className="text-xs font-medium text-slate-500">Active Photo</p>
                <p className="text-sm font-semibold text-[#0F172A]">
                  {hasCustomLocalPhoto ? 'Custom Device Photo' : 'Official Profile Photo'}
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full inline-flex items-center justify-center gap-2 min-h-[46px] px-4 rounded-xl bg-[#0B2545] text-white text-sm font-medium hover:bg-[#133863] transition-colors cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <span>Upload Photo from Device</span>
              </button>

              {hasCustomLocalPhoto && (
                <button
                  type="button"
                  onClick={() => {
                    setImgFailed(false);
                    onResetPhoto();
                    setPhotoModalOpen(false);
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 min-h-[44px] rounded-xl border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restore Default Profile Photo</span>
                </button>
              )}
            </div>

            {photoError && (
              <p className="mt-3 rounded-xl bg-red-50 border border-red-200 px-3.5 py-2 text-xs font-medium text-red-700">
                {photoError}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
};
