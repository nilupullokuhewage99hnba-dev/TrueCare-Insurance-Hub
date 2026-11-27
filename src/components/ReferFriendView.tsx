import React, { useEffect, useState } from 'react';
import {
  CheckCircle2,
  Gift,
  Lock,
  MessageCircle,
  Send,
  Sparkles,
  UserCheck,
  Users,
} from 'lucide-react';
import { Product, ReferralSubmissionPayload } from '../types';
import { buildWhatsAppUrl } from '../data/advisorData';
import { submitReferralToGateway } from '../services/truecareApi';

interface ReferFriendViewProps {
  products: Product[];
  preselectedProduct?: string;
  onCheckRewardsForPhone: (phone: string) => void;
}

export const ReferFriendView: React.FC<ReferFriendViewProps> = ({
  products,
  preselectedProduct,
  onCheckRewardsForPhone,
}) => {
  const [referrerName, setReferrerName] = useState('');
  const [referrerPhone, setReferrerPhone] = useState('');
  const [friendName, setFriendName] = useState('');
  const [friendPhone, setFriendPhone] = useState('');
  const [interestedIn, setInterestedIn] = useState(
    preselectedProduct || products[0]?.productName || 'Child Education Plan'
  );
  const [notes, setNotes] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [submittedResult, setSubmittedResult] = useState<{
    payload: ReferralSubmissionPayload;
    message: string;
    referralId?: string;
  } | null>(null);

  useEffect(() => {
    if (preselectedProduct) {
      setInterestedIn(preselectedProduct);
    } else if (products.length > 0 && !interestedIn) {
      setInterestedIn(products[0].productName);
    }
  }, [preselectedProduct, products, interestedIn]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!referrerName.trim() || !referrerPhone.trim() || !friendName.trim() || !friendPhone.trim()) {
      setFormError('Please fill in both your details and your friend’s name and phone number.');
      return;
    }

    const payload: ReferralSubmissionPayload = {
      referrerName: referrerName.trim(),
      referrerPhone: referrerPhone.trim(),
      friendName: friendName.trim(),
      friendPhone: friendPhone.trim(),
      interestedIn,
      notes: notes.trim(),
    };

    setSubmitting(true);
    try {
      const response = await submitReferralToGateway(payload);
      setSubmittedResult({
        payload,
        message: response.message,
        referralId: response.referralId,
      });
      setFriendName('');
      setFriendPhone('');
      setNotes('');
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Unable to submit referral right now. Please try again.';
      setFormError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-7">
      {/* Header */}
      <div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-[11px] font-semibold text-[#9A6B1C] tracking-wide">
          <Sparkles className="w-3.5 h-3.5 text-[#D4A84F]" />
          <span>Client Advocacy &amp; Rewards</span>
        </span>
        <h1 className="mt-2 font-display text-2xl sm:text-3xl font-bold text-[#0B2545]">
          Refer a Friend
        </h1>
        <p className="mt-1.5 text-sm text-slate-600 max-w-2xl">
          Recommend Nilupul Lokuhewage to a friend or family member. Every successful policy unlocks loyalty points, LKR credits, and gift vouchers.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Referral Form */}
        <div className="lg:col-span-7 relative rounded-3xl bg-white border border-slate-200/80 overflow-hidden shadow-[0_12px_36px_-15px_rgba(11,37,69,0.12)]">
          <div className="h-1.5 w-full bg-gradient-to-r from-[#0B2545] via-[#D4A84F] to-[#0B2545]" />

          <div className="p-6 sm:p-8">
            {submittedResult ? (
              <div className="py-6 text-center">
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto shadow-xs">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                </div>
                <h2 className="mt-4 text-xl font-bold text-[#0B2545]">
                  Referral Submitted Successfully
                </h2>
                {submittedResult.referralId && (
                  <p className="mt-1.5 inline-block px-3 py-1 rounded-full bg-slate-100 text-xs font-mono-tabular font-semibold text-slate-600">
                    Reference ID: {submittedResult.referralId}
                  </p>
                )}
                <p className="mt-3 text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                  {submittedResult.message ||
                    `Thank you, ${submittedResult.payload.referrerName}. Your referral for ${submittedResult.payload.friendName} has been securely recorded with Nilupul’s advisory desk.`}
                </p>

                <div className="mt-7 flex flex-col sm:flex-row justify-center gap-3">
                  <a
                    href={buildWhatsAppUrl(
                      `Hello Nilupul, I just submitted a referral via TrueCare.\nMy Name: ${submittedResult.payload.referrerName} (${submittedResult.payload.referrerPhone})\nFriend: ${submittedResult.payload.friendName} (${submittedResult.payload.friendPhone})\nInterested In: ${submittedResult.payload.interestedIn}${
                        submittedResult.payload.notes ? `\nNotes: ${submittedResult.payload.notes}` : ''
                      }`
                    )}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 min-h-[48px] px-5 rounded-xl bg-gradient-to-r from-[#059669] to-[#0F766E] text-white text-sm font-semibold shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Send Copy on WhatsApp</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => onCheckRewardsForPhone(submittedResult.payload.referrerPhone)}
                    className="inline-flex items-center justify-center gap-2 min-h-[48px] px-5 rounded-xl border border-slate-200 bg-white text-[#0B2545] text-sm font-semibold hover:border-[#D4A84F] hover:bg-amber-50/40 transition-all cursor-pointer"
                  >
                    <Gift className="w-4 h-4 text-[#B4832D]" />
                    <span>Check My Rewards</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setSubmittedResult(null)}
                  className="mt-5 min-h-[40px] text-xs font-semibold text-slate-500 hover:text-[#0B2545] cursor-pointer"
                >
                  Submit Another Referral
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-[#B4832D]" />
                    <h2 className="text-base font-bold text-[#0B2545]">Your Details</h2>
                  </div>
                  <div className="mt-3.5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="ref-your-name"
                        className="block text-xs font-semibold text-slate-700 mb-1.5"
                      >
                        Your Name
                      </label>
                      <input
                        id="ref-your-name"
                        type="text"
                        required
                        placeholder="Enter your full name"
                        value={referrerName}
                        onChange={(e) => setReferrerName(e.target.value)}
                        className="w-full min-h-[46px] rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 text-sm text-[#0F172A] focus:bg-white focus:border-[#0B2545] focus:ring-2 focus:ring-[#0B2545]/10 focus:outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="ref-your-phone"
                        className="block text-xs font-semibold text-slate-700 mb-1.5"
                      >
                        Your Phone Number
                      </label>
                      <input
                        id="ref-your-phone"
                        type="tel"
                        required
                        placeholder="07X XXX XXXX"
                        value={referrerPhone}
                        onChange={(e) => setReferrerPhone(e.target.value)}
                        className="w-full min-h-[46px] rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 text-sm text-[#0F172A] focus:bg-white focus:border-[#0B2545] focus:ring-2 focus:ring-[#0B2545]/10 focus:outline-none tabular-nums transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-5 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#B4832D]" />
                    <h2 className="text-base font-bold text-[#0B2545]">Friend’s Details</h2>
                  </div>
                  <div className="mt-3.5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="ref-friend-name"
                        className="block text-xs font-semibold text-slate-700 mb-1.5"
                      >
                        Friend’s Name
                      </label>
                      <input
                        id="ref-friend-name"
                        type="text"
                        required
                        placeholder="Enter friend's full name"
                        value={friendName}
                        onChange={(e) => setFriendName(e.target.value)}
                        className="w-full min-h-[46px] rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 text-sm text-[#0F172A] focus:bg-white focus:border-[#0B2545] focus:ring-2 focus:ring-[#0B2545]/10 focus:outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="ref-friend-phone"
                        className="block text-xs font-semibold text-slate-700 mb-1.5"
                      >
                        Friend’s Phone Number
                      </label>
                      <input
                        id="ref-friend-phone"
                        type="tel"
                        required
                        placeholder="07X XXX XXXX"
                        value={friendPhone}
                        onChange={(e) => setFriendPhone(e.target.value)}
                        className="w-full min-h-[46px] rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 text-sm text-[#0F172A] focus:bg-white focus:border-[#0B2545] focus:ring-2 focus:ring-[#0B2545]/10 focus:outline-none tabular-nums transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label
                      htmlFor="ref-product"
                      className="block text-xs font-semibold text-slate-700 mb-1.5"
                    >
                      Interested Product
                    </label>
                    <select
                      id="ref-product"
                      value={interestedIn}
                      onChange={(e) => setInterestedIn(e.target.value)}
                      className="w-full min-h-[46px] rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 text-sm text-[#0F172A] focus:bg-white focus:border-[#0B2545] focus:ring-2 focus:ring-[#0B2545]/10 focus:outline-none transition-all"
                    >
                      {products.map((p) => (
                        <option key={p.productId} value={p.productName}>
                          {p.productName} ({p.category})
                        </option>
                      ))}
                      <option value="General Life & Financial Consultation">
                        General Life &amp; Financial Consultation
                      </option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="ref-notes"
                      className="block text-xs font-semibold text-slate-700 mb-1.5"
                    >
                      Notes (Optional — best time to call or specific goal)
                    </label>
                    <textarea
                      id="ref-notes"
                      rows={3}
                      placeholder="e.g. Interested in a child education plan; prefers a call after 5:30 PM."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-sm text-[#0F172A] focus:bg-white focus:border-[#0B2545] focus:ring-2 focus:ring-[#0B2545]/10 focus:outline-none resize-none transition-all"
                    />
                  </div>
                </div>

                {formError && (
                  <p className="rounded-xl bg-red-50 border border-red-200 px-3.5 py-2.5 text-xs font-semibold text-red-700">
                    {formError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full inline-flex items-center justify-center gap-2 min-h-[50px] px-5 rounded-xl bg-gradient-to-r from-[#0B2545] to-[#163B6B] text-white text-sm font-semibold shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-60"
                >
                  <Send className="w-4 h-4 text-[#E8C574]" />
                  <span>{submitting ? 'Submitting Referral…' : 'Submit Referral'}</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Right Column: How Referral Rewards Work & Privacy Note */}
        <div className="lg:col-span-5 space-y-5">
          <div className="rounded-3xl bg-gradient-to-br from-[#071930] via-[#0B2545] to-[#133863] text-white p-6 sm:p-7 shadow-[0_12px_36px_-14px_rgba(11,37,69,0.35)] relative overflow-hidden">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-16 -right-16 w-48 h-48 rounded-full bg-[#D4A84F]/15 blur-3xl"
            />
            <div className="relative z-10">
              <div className="flex items-center gap-2">
                <Gift className="w-4 h-4 text-[#F3D58D]" />
                <h2 className="text-base font-bold text-white">How Referral Rewards Work</h2>
              </div>
              <ol className="mt-5 space-y-3.5">
                <li className="flex gap-3 bg-white/[0.05] border border-white/[0.08] rounded-2xl p-3.5">
                  <span className="font-mono-tabular text-xs font-bold text-[#F3D58D] pt-0.5 shrink-0">
                    01.
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">Share a Friend’s Contact</p>
                    <p className="mt-0.5 text-xs text-slate-300 leading-relaxed">
                      Submit their name, phone number, and the protection plan they are exploring.
                    </p>
                  </div>
                </li>
                <li className="flex gap-3 bg-white/[0.05] border border-white/[0.08] rounded-2xl p-3.5">
                  <span className="font-mono-tabular text-xs font-bold text-[#F3D58D] pt-0.5 shrink-0">
                    02.
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">No-Pressure Personal Consultation</p>
                    <p className="mt-0.5 text-xs text-slate-300 leading-relaxed">
                      Nilupul reaches out courteously with a tailored HNB Life benefit illustration.
                    </p>
                  </div>
                </li>
                <li className="flex gap-3 bg-white/[0.05] border border-white/[0.08] rounded-2xl p-3.5">
                  <span className="font-mono-tabular text-xs font-bold text-[#F3D58D] pt-0.5 shrink-0">
                    03.
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">Unlock Points &amp; Gift Vouchers</p>
                    <p className="mt-0.5 text-xs text-slate-300 leading-relaxed">
                      When their policy activates, verify with your phone number and 4-digit PIN in the Rewards tab to claim your vouchers.
                    </p>
                  </div>
                </li>
              </ol>
            </div>
          </div>

          <div className="rounded-2xl bg-white border border-slate-200/80 p-6 shadow-xs">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200/70 flex items-center justify-center shrink-0">
                <Lock className="w-4 h-4 text-[#B4832D]" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-[#0B2545]">Private &amp; Confidential</h2>
                <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                  Referral details are sent securely to Nilupul’s private advisory desk and are never shown to other clients.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
