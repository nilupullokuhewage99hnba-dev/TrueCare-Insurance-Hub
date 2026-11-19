import React, { useEffect, useState } from 'react';
import {
  CheckCircle2,
  Gift,
  Lock,
  MessageCircle,
  Send,
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
    <div className="space-y-6">
      <div>
        <p className="text-xs font-medium text-[#B4832D]">Client Advocacy & Rewards</p>
        <h1 className="mt-1 font-display text-2xl sm:text-3xl font-semibold text-[#0B2545]">
          Refer a Friend
        </h1>
        <p className="mt-1.5 text-sm text-slate-600 max-w-2xl">
          Recommend Nilupul Lokuhewage to a friend or family member. Every successful policy unlocks loyalty points, LKR credits, and gift vouchers.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Referral Form */}
        <div className="lg:col-span-7 rounded-3xl bg-white border border-slate-200/80 p-6 sm:p-8 shadow-xs">
          {submittedResult ? (
            <div className="py-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6 text-[#0F766E]" />
              </div>
              <h2 className="mt-4 text-xl font-semibold text-[#0F172A]">
                Referral Submitted Successfully
              </h2>
              {submittedResult.referralId && (
                <p className="mt-1 text-xs font-mono-tabular text-slate-500">
                  Reference ID: {submittedResult.referralId}
                </p>
              )}
              <p className="mt-3 text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                {submittedResult.message ||
                  `Thank you, ${submittedResult.payload.referrerName}. Your referral for ${submittedResult.payload.friendName} has been securely recorded with Nilupul’s advisory desk.`}
              </p>

              <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
                <a
                  href={buildWhatsAppUrl(
                    `Hello Nilupul, I just submitted a referral via TrueCare.\nMy Name: ${submittedResult.payload.referrerName} (${submittedResult.payload.referrerPhone})\nFriend: ${submittedResult.payload.friendName} (${submittedResult.payload.friendPhone})\nInterested In: ${submittedResult.payload.interestedIn}${
                      submittedResult.payload.notes ? `\nNotes: ${submittedResult.payload.notes}` : ''
                    }`
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 min-h-[48px] px-5 rounded-xl bg-[#0F766E] text-white text-sm font-medium hover:bg-[#115E59] transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send Copy on WhatsApp</span>
                </a>

                <button
                  type="button"
                  onClick={() => onCheckRewardsForPhone(submittedResult.payload.referrerPhone)}
                  className="inline-flex items-center justify-center gap-2 min-h-[48px] px-5 rounded-xl border border-slate-200 bg-white text-[#0B2545] text-sm font-medium hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <Gift className="w-4 h-4 text-[#B4832D]" />
                  <span>Check My Rewards</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setSubmittedResult(null)}
                className="mt-4 min-h-[40px] text-xs font-medium text-slate-500 hover:text-[#0B2545] cursor-pointer"
              >
                Submit Another Referral
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <h2 className="text-base font-semibold text-[#0F172A]">Your Details</h2>
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="ref-your-name"
                      className="block text-xs font-medium text-slate-700 mb-1.5"
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
                      className="w-full min-h-[44px] rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 text-sm text-[#0F172A] focus:bg-white focus:border-[#0B2545] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="ref-your-phone"
                      className="block text-xs font-medium text-slate-700 mb-1.5"
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
                      className="w-full min-h-[44px] rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 text-sm text-[#0F172A] focus:bg-white focus:border-[#0B2545] focus:outline-none tabular-nums"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <h2 className="text-base font-semibold text-[#0F172A]">Friend’s Details</h2>
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="ref-friend-name"
                      className="block text-xs font-medium text-slate-700 mb-1.5"
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
                      className="w-full min-h-[44px] rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 text-sm text-[#0F172A] focus:bg-white focus:border-[#0B2545] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="ref-friend-phone"
                      className="block text-xs font-medium text-slate-700 mb-1.5"
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
                      className="w-full min-h-[44px] rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 text-sm text-[#0F172A] focus:bg-white focus:border-[#0B2545] focus:outline-none tabular-nums"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label
                    htmlFor="ref-product"
                    className="block text-xs font-medium text-slate-700 mb-1.5"
                  >
                    Interested Product
                  </label>
                  <select
                    id="ref-product"
                    value={interestedIn}
                    onChange={(e) => setInterestedIn(e.target.value)}
                    className="w-full min-h-[44px] rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 text-sm text-[#0F172A] focus:bg-white focus:border-[#0B2545] focus:outline-none"
                  >
                    {products.map((p) => (
                      <option key={p.productId} value={p.productName}>
                        {p.productName} ({p.category})
                      </option>
                    ))}
                    <option value="General Life & Financial Consultation">
                      General Life & Financial Consultation
                    </option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="ref-notes"
                    className="block text-xs font-medium text-slate-700 mb-1.5"
                  >
                    Notes (Optional — best time to call or specific goal)
                  </label>
                  <textarea
                    id="ref-notes"
                    rows={3}
                    placeholder="e.g. Interested in a child education plan; prefers a call after 5:30 PM."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-[#0F172A] focus:bg-white focus:border-[#0B2545] focus:outline-none resize-none"
                  />
                </div>
              </div>

              {formError && (
                <p className="rounded-xl bg-red-50 border border-red-200 px-3.5 py-2.5 text-xs font-medium text-red-700">
                  {formError}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full inline-flex items-center justify-center gap-2 min-h-[48px] px-5 rounded-xl bg-[#0B2545] text-white text-sm font-medium hover:bg-[#133863] active:scale-[0.99] transition-all cursor-pointer disabled:opacity-60"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? 'Submitting Referral…' : 'Submit Referral'}</span>
              </button>
            </form>
          )}
        </div>

        {/* Right Column: How Referral Rewards Work & Privacy Note */}
        <div className="lg:col-span-5 space-y-5">
          <div className="rounded-2xl bg-white border border-slate-200/80 p-6">
            <h2 className="text-base font-semibold text-[#0F172A]">How Referral Rewards Work</h2>
            <ol className="mt-4 space-y-4">
              <li className="flex gap-3">
                <span className="font-mono-tabular text-xs font-semibold text-[#B4832D] pt-0.5 shrink-0">
                  01.
                </span>
                <div>
                  <p className="text-sm font-medium text-[#0F172A]">Share a Friend’s Contact</p>
                  <p className="mt-0.5 text-xs text-slate-600 leading-relaxed">
                    Submit their name, phone number, and the protection plan they are exploring.
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="font-mono-tabular text-xs font-semibold text-[#B4832D] pt-0.5 shrink-0">
                  02.
                </span>
                <div>
                  <p className="text-sm font-medium text-[#0F172A]">No-Pressure Personal Consultation</p>
                  <p className="mt-0.5 text-xs text-slate-600 leading-relaxed">
                    Nilupul reaches out courteously with a tailored HNB Life benefit illustration.
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="font-mono-tabular text-xs font-semibold text-[#B4832D] pt-0.5 shrink-0">
                  03.
                </span>
                <div>
                  <p className="text-sm font-medium text-[#0F172A]">Unlock Points & Gift Vouchers</p>
                  <p className="mt-0.5 text-xs text-slate-600 leading-relaxed">
                    When their policy activates, verify with your phone number and 4-digit PIN in the Rewards tab to claim your vouchers.
                  </p>
                </div>
              </li>
            </ol>
          </div>

          <div className="rounded-2xl bg-white border border-slate-200/80 p-6">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center shrink-0">
                <Lock className="w-4 h-4 text-[#0B2545]" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-[#0F172A]">Private & Confidential</h2>
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
