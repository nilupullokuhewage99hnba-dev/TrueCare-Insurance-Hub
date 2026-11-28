import React, { useMemo, useState } from 'react';
import {
  Calendar,
  Gift,
  Mail,
  MapPin,
  MessageCircle,
  Sparkles,
  Tag,
} from 'lucide-react';
import { EventOffer, OfferType } from '../types';
import { buildWhatsAppUrl } from '../data/advisorData';

interface EventsOffersViewProps {
  eventsOffers: EventOffer[];
  onOpenEmail: (subject?: string, body?: string) => void;
}

const FILTER_OPTIONS: Array<'All' | OfferType> = ['All', 'Free Program', 'Event', 'Special Offer'];

const GOLDEN_BEGINNING_IMAGE_URL = 'https://i.ibb.co/1t6TSmnL/IMG-1854.jpg';
const FREE_PROGRAM_IMAGE_URL = 'https://i.ibb.co/zT8j5ZCb/IMG-1855.png';
const SIGNATURE_MEMBERS_IMAGE_URL = 'https://i.ibb.co/QvPk2H1n/IMG-20261128-WA0001.jpg';

function getOfferStyling(type: OfferType) {
  switch (type) {
    case 'Free Program':
      return {
        topBar: 'from-emerald-600 to-teal-400',
        badge: 'bg-emerald-50 text-emerald-800 border-emerald-200/70',
        iconColor: 'text-emerald-600',
        Icon: Gift,
      };
    case 'Special Offer':
      return {
        topBar: 'from-[#B4832D] to-[#F59E0B]',
        badge: 'bg-amber-50 text-[#9A6B1C] border-amber-200/70',
        iconColor: 'text-[#D4A84F]',
        Icon: Tag,
      };
    default:
      return {
        topBar: 'from-[#0B2545] to-[#D4A84F]',
        badge: 'bg-blue-50 text-[#0B2545] border-blue-200/70',
        iconColor: 'text-[#B4832D]',
        Icon: Calendar,
      };
  }
}

function resolveOfferImage(item: EventOffer): string | null {
  const raw = item as unknown as Record<string, unknown>;
  const candidates = [raw.bannerUrl, raw.Banner_URL, raw.imageUrl, raw.Image_URL];
  for (const val of candidates) {
    if (typeof val === 'string' && val.trim().startsWith('http')) {
      return val.trim();
    }
  }

  const idUpper = (item.id || '').toUpperCase().trim();
  const titleLower = (item.title || '').toLowerCase();

  if (idUpper === 'GB-2027-01' || (item.type === 'Special Offer' && titleLower.includes('golden beginning'))) {
    return GOLDEN_BEGINNING_IMAGE_URL;
  }

  if (idUpper === 'GB-2027-02' || (item.type === 'Free Program' && titleLower.includes('financial review'))) {
    return FREE_PROGRAM_IMAGE_URL;
  }

  if (idUpper === 'GB-2027-03' || titleLower.includes('signature members')) {
    return SIGNATURE_MEMBERS_IMAGE_URL;
  }

  return null;
}

function OfferBanner({ imageUrl, title }: { imageUrl: string; title: string }) {
  const [imgError, setImgError] = useState(false);

  if (imgError) return null;

  return (
    <div className="w-full bg-[#0B2545]/5 border-b border-slate-100 overflow-hidden flex items-center justify-center">
      <img
        src={imageUrl}
        alt={title}
        referrerPolicy="no-referrer"
        onError={() => setImgError(true)}
        className="w-auto max-w-full max-h-[420px] object-contain group-hover:scale-[1.02] transition-transform duration-500"
      />
    </div>
  );
}

export const EventsOffersView: React.FC<EventsOffersViewProps> = ({
  eventsOffers,
  onOpenEmail,
}) => {
  const [filter, setFilter] = useState<'All' | OfferType>('All');

  const filtered = useMemo(() => {
    if (filter === 'All') return eventsOffers;
    return eventsOffers.filter((item) => item.type === filter);
  }, [eventsOffers, filter]);

  return (
    <div className="space-y-7">
      {/* Header */}
      <div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-[11px] font-semibold text-[#9A6B1C] tracking-wide">
          <Sparkles className="w-3.5 h-3.5 text-[#D4A84F]" />
          <span>Client Programs &amp; Promotions</span>
        </span>
        <h1 className="mt-2 font-display text-2xl sm:text-3xl font-bold text-[#0B2545]">
          Events &amp; Special Offers
        </h1>
        <p className="mt-1.5 text-sm text-slate-600 max-w-2xl">
          Upcoming financial planning clinics, complimentary coverage reviews, and seasonal HNB Life client offers.
        </p>
      </div>

      {/* Filter Bar */}
      <div
        role="tablist"
        aria-label="Filter events and offers"
        className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1"
      >
        {FILTER_OPTIONS.map((option) => {
          const active = filter === option;
          return (
            <button
              key={option}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setFilter(option)}
              className={`min-h-[40px] px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                active
                  ? 'bg-[#0B2545] text-[#F3D58D] shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:text-[#0B2545] hover:border-[#D4A84F]/60'
              }`}
            >
              {option === 'All' ? 'All Programs & Offers' : `${option}s`}
            </button>
          );
        })}
      </div>

      {/* Events & Offers Cards */}
      {filtered.length === 0 ? (
        <div className="rounded-3xl bg-white border border-slate-200/80 p-10 text-center shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200/70 flex items-center justify-center mx-auto">
            <Calendar className="w-6 h-6 text-[#B4832D]" />
          </div>
          <p className="mt-4 text-base font-bold text-[#0B2545]">
            No upcoming events or offers posted right now
          </p>
          <p className="mt-1.5 text-sm text-slate-500 max-w-md mx-auto">
            New client clinics and special offers will appear here automatically. You can also message Nilupul directly for a complimentary protection review.
          </p>
          <div className="mt-6 flex justify-center">
            <a
              href={buildWhatsAppUrl(
                'Hello Nilupul, could you let me know about any upcoming HNB Life offers or client programs?'
              )}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 min-h-[46px] px-5 rounded-xl bg-gradient-to-r from-[#059669] to-[#0F766E] text-white text-sm font-semibold shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Ask on WhatsApp</span>
            </a>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filtered.map((item) => {
            const waUrl = buildWhatsAppUrl(
              `Hello Nilupul, I would like to ${item.ctaLabel.toLowerCase()} for "${item.title}" (${item.date}).`
            );
            const style = getOfferStyling(item.type);
            const TypeIcon = style.Icon;
            const offerImage = resolveOfferImage(item);

            return (
              <article
                key={item.id}
                className="group relative rounded-2xl bg-white border border-slate-200/80 flex flex-col justify-between shadow-xs hover:shadow-lg hover:border-[#D4A84F]/60 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              >
                <div className={`absolute top-0 inset-x-0 h-1 bg-gradient-to-r ${style.topBar} z-10`} />

                <div>
                  {offerImage && <OfferBanner imageUrl={offerImage} title={item.title} />}

                  <div className="p-6">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border font-semibold ${style.badge}`}
                      >
                        <TypeIcon className={`w-3.5 h-3.5 ${style.iconColor}`} />
                        <span>{item.type}</span>
                      </span>
                      <div className="flex items-center gap-2 text-slate-500">
                        <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          {item.status}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono-tabular text-slate-400">{item.id}</span>
                      </div>
                    </div>

                    <h2 className="mt-3.5 text-xl font-bold text-[#0F172A] group-hover:text-[#0B2545] leading-snug transition-colors">
                      {item.title}
                    </h2>

                    <p className="mt-2.5 text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                      {item.summary}
                    </p>

                    {/* Date & Location Info Box */}
                    <div className="mt-5 p-3.5 rounded-xl bg-slate-50/90 border border-slate-200/70 space-y-2 text-xs text-slate-700">
                      <div className="flex items-center gap-2.5">
                        <Calendar className="w-4 h-4 text-[#B4832D] shrink-0" />
                        <span className="font-medium tabular-nums">{item.date}</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <MapPin className="w-4 h-4 text-[#B4832D] shrink-0" />
                        <span className="font-medium">{item.location}</span>
                      </div>
                    </div>

                    {/* Highlight Strip */}
                    <div className="mt-4 px-3.5 py-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200/60 text-xs font-semibold text-[#0F766E]">
                      {item.highlight}
                    </div>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-2.5">
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 min-h-[46px] px-4 rounded-xl bg-gradient-to-r from-[#0B2545] to-[#163B6B] text-white text-sm font-semibold shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] transition-all whitespace-nowrap"
                  >
                    <MessageCircle className="w-4 h-4 text-[#E8C574]" />
                    <span>{item.ctaLabel} via WhatsApp</span>
                  </a>

                  <button
                    type="button"
                    onClick={() =>
                      onOpenEmail(
                        `${item.ctaLabel}: ${item.title}`,
                        `Hello Nilupul,\n\nI would like to register for "${item.title}" (${item.date}).\n\nPlease confirm availability and share the next steps.\n\nThank you.`
                      )
                    }
                    className="inline-flex items-center justify-center gap-2 min-h-[46px] px-4 rounded-xl border border-slate-200 bg-white text-[#0B2545] text-sm font-semibold hover:border-[#D4A84F] hover:bg-amber-50/40 active:scale-[0.98] transition-all whitespace-nowrap cursor-pointer"
                  >
                    <Mail className="w-4 h-4 text-[#B4832D]" />
                    <span>RSVP via Email</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
