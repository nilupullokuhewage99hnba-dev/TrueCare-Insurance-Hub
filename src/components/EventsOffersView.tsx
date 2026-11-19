import React, { useMemo, useState } from 'react';
import { Calendar, Mail, MapPin, MessageCircle } from 'lucide-react';
import { EventOffer, OfferType } from '../types';
import { buildWhatsAppUrl } from '../data/advisorData';

interface EventsOffersViewProps {
  eventsOffers: EventOffer[];
  onOpenEmail: (subject?: string, body?: string) => void;
}

const FILTER_OPTIONS: Array<'All' | OfferType> = ['All', 'Free Program', 'Event', 'Special Offer'];

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
    <div className="space-y-6">
      <div>
        <p className="text-xs font-medium text-[#B4832D]">Client Programs & Promotions</p>
        <h1 className="mt-1 font-display text-2xl sm:text-3xl font-semibold text-[#0B2545]">
          Events & Special Offers
        </h1>
        <p className="mt-1.5 text-sm text-slate-600 max-w-2xl">
          Upcoming financial planning clinics, complimentary coverage reviews, and seasonal HNB Life client offers.
        </p>
      </div>

      {/* Filter Bar */}
      <div
        role="tablist"
        aria-label="Filter events and offers"
        className="flex items-center gap-1.5 overflow-x-auto pb-1 -mx-1 px-1"
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
              className={`min-h-[40px] px-4 py-2 rounded-xl text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                active
                  ? 'bg-[#0B2545] text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:text-[#0B2545] hover:border-slate-300'
              }`}
            >
              {option === 'All' ? 'All Programs & Offers' : `${option}s`}
            </button>
          );
        })}
      </div>

      {/* Events & Offers Cards */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl bg-white border border-slate-200/80 p-10 text-center">
          <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-center mx-auto">
            <Calendar className="w-6 h-6 text-[#B4832D]" />
          </div>
          <p className="mt-4 text-base font-semibold text-[#0F172A]">
            No upcoming events or offers posted right now
          </p>
          <p className="mt-1.5 text-sm text-slate-500 max-w-md mx-auto">
            New client clinics and special offers will appear here automatically. You can also message Nilupul directly for a complimentary protection review.
          </p>
          <div className="mt-5 flex justify-center">
            <a
              href={buildWhatsAppUrl(
                'Hello Nilupul, could you let me know about any upcoming HNB Life offers or client programs?'
              )}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 rounded-xl bg-[#0F766E] text-white text-sm font-medium hover:bg-[#115E59] transition-colors"
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
            return (
              <article
                key={item.id}
                className="rounded-2xl bg-white border border-slate-200/80 p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
                    <span className="font-medium text-[#B4832D]">{item.type}</span>
                    <span aria-hidden="true">·</span>
                    <span>Status: {item.status}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono-tabular">{item.id}</span>
                  </div>

                  <h2 className="mt-2.5 text-xl font-semibold text-[#0F172A] leading-snug">
                    {item.title}
                  </h2>

                  <p className="mt-2.5 text-sm text-slate-600 leading-relaxed">{item.summary}</p>

                  <div className="mt-5 space-y-2 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="tabular-nums">{item.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>{item.location}</span>
                    </div>
                  </div>

                  <p className="mt-4 pt-4 border-t border-slate-100 text-xs font-medium text-[#0F766E]">
                    {item.highlight}
                  </p>
                </div>

                <div className="mt-5 flex flex-col sm:flex-row gap-2.5">
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 min-h-[44px] px-4 rounded-xl bg-[#0B2545] text-white text-sm font-medium hover:bg-[#133863] transition-colors whitespace-nowrap"
                  >
                    <MessageCircle className="w-4 h-4" />
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
                    className="inline-flex items-center justify-center gap-2 min-h-[44px] px-4 rounded-xl border border-slate-200 bg-white text-[#0B2545] text-sm font-medium hover:bg-slate-50 transition-colors whitespace-nowrap cursor-pointer"
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
