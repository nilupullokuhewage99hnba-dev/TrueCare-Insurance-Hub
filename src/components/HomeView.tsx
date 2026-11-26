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
      {/* Lightweight Custom Animations (Zero external dependencies) */}
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
                className="pointer-
