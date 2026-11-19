import React, { useRef, useState } from 'react';
import {
  ArrowRight,
  Calendar,
  Camera,
  Gift,
  Mail,
  MessageCircle,
  Phone,
  RefreshCw,
  RotateCcw,
  ShieldCheck,
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

  const directWhatsAppUrl = buildWhatsAppUrl(
    'Hello Nilupul, I am reaching out via the TrueCare app and would like guidance on HNB Life protection plans.'
  );

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
      <div className="space-y-8 md:space-y-10">
        {/* Hero & Advisor Profile Split */}
        <section className="rounded-3xl bg-white border border-slate-200/80 overflow-hidden shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            {/* Left: Brand Lockup, Advisor Identity & One-Tap Contact */}
            <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
              <div>
                <TrueCareLogo variant="hero" />

                <p className="mt-6 text-xs font-medium text-[#B4832D] tracking-wide">
                  {advisor.role}
                </p>
                <h1 className="mt-1.5 font-display text-3xl sm:text-4xl lg:text-[2.6rem] font-semibold tracking-tight text-[#0B2545] leading-[1.12]">
                  {advisor.fullName}
                </h1>
                <p className="mt-4 text-[15px] sm:text-base text-slate-600 leading-relaxed max-w-2xl">
                  {advisor.bio}
                </p>

                {/* One-Tap Contact Controls (Call: 071 941 4247 | WhatsApp: 070 127 9963 | Email) */}
                <div className="mt-7 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <a
                    href={ADVISOR.phoneTel}
                    className="inline-flex items-center justify-center gap-2 min-h-[48px] px-4 py-3 rounded-xl bg-[#0B2545] text-white text-sm font-medium hover:bg-[#133863] active:scale-[0.98] transition-all whitespace-nowrap"
                  >
                    <Phone className="w-4 h-4 shrink-0" />
                    <span className="tabular-nums">Call {ADVISOR.phoneDisplay}</span>
                  </a>

                  <a
                    href={directWhatsAppUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 min-h-[48px] px-4 py-3 rounded-xl bg-[#0F766E] text-white text-sm font-medium hover:bg-[#115E59] active:scale-[0.98] transition-all whitespace-nowrap"
                  >
                    <MessageCircle className="w-4 h-4 shrink-0" />
                    <span className="tabular-nums">WhatsApp {ADVISOR.whatsappDisplay}</span>
                  </a>

                  <button
                    type="button"
                    onClick={() =>
                      onOpenEmail(
                        'Personal Financial Consultation — TrueCare',
                        'Hello Nilupul,\n\nI would like to discuss life insurance and family protection options with you.\n\nBest regards,'
                      )
                    }
                    className="inline-flex items-center justify-center gap-2 min-h-[48px] px-4 py-3 rounded-xl border border-slate-200 bg-white text-[#0B2545] text-sm font-medium hover:bg-slate-50 active:scale-[0.98] transition-all whitespace-nowrap cursor-pointer"
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
                      href={ADVISOR.phoneTel}
                      className="font-mono-tabular text-slate-700 hover:text-[#0B2545]"
                    >
                      {ADVISOR.phoneRaw}
                    </a>
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>
                    WhatsApp:{' '}
                    <a
                      href={directWhatsAppUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono-tabular text-slate-700 hover:text-[#0F766E]"
                    >
                      {ADVISOR.whatsappRaw}
                    </a>
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono-tabular text-slate-700">{advisor.email}</span>
                </div>
                <PWAInstallButton variant="compact" />
              </div>
            </div>

            {/* Right: Advisor Profile Photo Frame & Advisory Commitment Plate */}
            <div className="lg:col-span-5 bg-[#0B2545] text-white p-6 sm:p-8 lg:p-10 flex flex-col justify-between relative overflow-hidden">
              <svg
                className="absolute -right-12 -top-12 w-64 h-64 text-white/[0.05] pointer-events-none"
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
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-[#133863] border-2 border-[#D4A84F]/60 shadow-lg">
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
                    className="absolute -bottom-2 -right-2 min-h-[36px] min-w-[36px] rounded-xl bg-white text-[#0B2545] shadow-md border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                </div>

                <div className="min-w-0">
                  <p className="text-xs text-[#E8C574] font-medium tracking-wide">
                    TrueCare Advisory Desk
                  </p>
                  <p className="mt-0.5 text-lg font-semibold text-white leading-snug">
                    {advisor.displayName}
                  </p>
                  <p className="text-xs text-slate-300 mt-0.5">
                    {advisor.company} · Personal Protection
                  </p>
                </div>
              </div>

              <div className="relative z-10 mt-8 space-y-3.5">
                <p className="text-xs font-medium text-slate-300">How I work with every client</p>
                <ul className="space-y-3">
                  {ADVISOR.servicePromise.map((promise, index) => (
                    <li
                      key={promise}
                      className="flex items-start gap-3 text-sm text-slate-100 leading-snug"
                    >
                      <span className="font-mono-tabular text-xs text-[#E8C574] pt-0.5 shrink-0">
                        0{index + 1}.
                      </span>
                      <span>{promise}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="relative z-10 mt-8 pt-5 border-t border-white/10 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-xs text-slate-300">TrueCare Live Catalog</p>
                  <p className="text-xs font-medium text-white truncate tabular-nums">
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
                  className="inline-flex items-center gap-1.5 min-h-[40px] px-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-medium text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-[#E8C574] ${isLoadingData ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Destinations Strip */}
        <section
          aria-label="Quick navigation highlights"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {/* Highlight 1: Featured Plan */}
          {featuredProduct ? (
            <div className="rounded-2xl bg-white border border-slate-200/80 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Featured Plan · {featuredProduct.category}</span>
                  <span className="font-mono-tabular">{featuredProduct.productId}</span>
                </div>
                <h2 className="mt-2.5 text-lg font-semibold text-[#0F172A]">
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
                  <ArrowRight className="w-4 h-4" />
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
            <div className="rounded-2xl bg-white border border-slate-200/80 p-6 flex flex-col justify-between">
              <div>
                <p className="text-xs text-slate-500">HNB Life Portfolio</p>
                <h2 className="mt-2.5 text-lg font-semibold text-[#0F172A]">
                  Protection & Education Plans
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
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Highlight 2: Upcoming Event / Offer */}
          <div className="rounded-2xl bg-white border border-slate-200/80 p-6 flex flex-col justify-between">
            {featuredOffer ? (
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>
                    {featuredOffer.type} · {featuredOffer.status}
                  </span>
                  <Calendar className="w-4 h-4 text-[#B4832D]" />
                </div>
                <h2 className="mt-2.5 text-lg font-semibold text-[#0F172A]">
                  {featuredOffer.title}
                </h2>
                <p className="mt-1.5 text-sm text-slate-600 leading-relaxed line-clamp-3">
                  {featuredOffer.summary}
                </p>
                <p className="mt-3 text-xs font-medium text-[#0F766E]">
                  {featuredOffer.highlight}
                </p>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Events & Special Offers</span>
                  <Calendar className="w-4 h-4 text-[#B4832D]" />
                </div>
                <h2 className="mt-2.5 text-lg font-semibold text-[#0F172A]">
                  Client Clinics & Seasonal Offers
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
                className="inline-flex items-center gap-1.5 min-h-[44px] text-sm font-semibold text-[#0B2545] hover:text-[#B4832D] transition-colors cursor-pointer"
              >
                <span>View Events & Offers</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <span className="text-xs text-slate-500 tabular-nums">
                {eventsOffers.length} Active
              </span>
            </div>
          </div>

          {/* Highlight 3: Refer & Earn Rewards */}
          <div className="rounded-2xl bg-white border border-slate-200/80 p-6 flex flex-col justify-between md:col-span-2 lg:col-span-1">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Client Referral Program · Vouchers</span>
                <Gift className="w-4 h-4 text-[#B4832D]" />
              </div>
              <h2 className="mt-2.5 text-lg font-semibold text-[#0F172A]">
                Refer a Friend & Earn Gift Vouchers
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
