import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  Check,
  Copy,
  Eye,
  EyeOff,
  Gift,
  KeyRound,
  Lock,
  LogOut,
  Mail,
  MessageCircle,
  Phone,
  ShieldCheck,
  UserPlus,
} from 'lucide-react';
import { ClientRewardsResponse } from '../types';
import { buildWhatsAppUrl } from '../data/advisorData';
import { fetchClientRewards } from '../services/truecareApi';

interface RewardsViewProps {
  initialLookupPhone?: string;
  onNavigateToRefer: () => void;
  onOpenEmail: (subject?: string, body?: string) => void;
}

export const RewardsView: React.FC<RewardsViewProps> = ({
  initialLookupPhone = '',
  onNavigateToRefer,
  onOpenEmail,
}) => {
  const [phoneInput, setPhoneInput] = useState(initialLookupPhone);
  const [pinInput, setPinInput] = useState('');
  const [showPin, setShowPin] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [verifiedData, setVerifiedData] = useState<ClientRewardsResponse | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    if (initialLookupPhone && !verifiedData) {
      setPhoneInput(initialLookupPhone);
    }
  }, [initialLookupPhone, verifiedData]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanPhone = phoneInput.trim();
    const cleanPin = pinInput.trim();

    if (!cleanPhone) {
      setErrorMsg('Please enter your registered phone number.');
      return;
    }
    if (!/^\d{4}$/.test(cleanPin)) {
      setErrorMsg('Please enter your 4-digit PIN.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetchClientRewards(cleanPhone, cleanPin);
      setVerifiedData(response);
      setPinInput('');
    } catch (err: unknown) {
      setVerifiedData(null);
      const msg = err instanceof Error ? err.message : 'Invalid Phone Number or PIN';
      setErrorMsg(msg || 'Invalid Phone Number or PIN');
    } finally {
      setLoading(false);
    }
  };

  const handleLockSession = () => {
    setVerifiedData(null);
    setPinInput('');
    setErrorMsg(null);
  };

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode((prev) => (prev === code ? null : prev)), 2000);
    } catch {
      // Ignore clipboard failures safely
    }
  };

  const formatLkr = (amount: number) => `LKR ${amount.toLocaleString('en-LK')}`;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-medium text-[#B4832D]">PIN-Protected Client Portal</p>
        <h1 className="mt-1 font-display text-2xl sm:text-3xl font-semibold text-[#0B2545]">
          Client Rewards & Vouchers
        </h1>
        <p className="mt-1.5 text-sm text-slate-600 max-w-2xl">
          Verify with your registered phone number and 4-digit client PIN to privately view your loyalty points, LKR credits, and claimable gift vouchers.
        </p>
      </div>

      {!verifiedData ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* PIN Verification Form */}
          <section className="lg:col-span-7 rounded-3xl bg-white border border-slate-200/80 p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-3 pb-5 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-[#0B2545]/5 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-[#0B2545]" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-[#0F172A]">Verify Your Identity</h2>
                <p className="text-xs text-slate-500">
                  Your reward records stay private and are unlocked only with your personal PIN.
                </p>
              </div>
            </div>

            <form onSubmit={handleVerify} className="mt-6 space-y-4">
              <div>
                <label
                  htmlFor="rewards-phone"
                  className="block text-xs font-medium text-slate-700 mb-1.5"
                >
                  Registered Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="rewards-phone"
                    type="tel"
                    required
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    placeholder="07X XXX XXXX"
                    autoComplete="tel"
                    className="w-full min-h-[48px] pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-[#0F172A] focus:bg-white focus:border-[#0B2545] focus:outline-none tabular-nums"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="rewards-pin"
                  className="block text-xs font-medium text-slate-700 mb-1.5"
                >
                  4-Digit Client PIN
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="rewards-pin"
                    type={showPin ? 'text' : 'password'}
                    inputMode="numeric"
                    pattern="[0-9]{4}"
                    maxLength={4}
                    required
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    placeholder="••••"
                    autoComplete="off"
                    className="w-full min-h-[48px] pl-10 pr-12 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-[#0F172A] tracking-[0.3em] font-mono-tabular focus:bg-white focus:border-[#0B2545] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin((prev) => !prev)}
                    aria-label={showPin ? 'Hide PIN' : 'Show PIN'}
                    className="absolute right-2 top-1/2 -translate-y-1/2 min-h-[40px] min-w-[40px] flex items-center justify-center text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {errorMsg && (
                <div
                  role="alert"
                  className="flex items-start gap-2.5 rounded-xl bg-red-50 border border-red-200 px-3.5 py-3 text-xs font-medium text-red-700"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 min-h-[48px] px-6 rounded-xl bg-[#0B2545] text-white text-sm font-medium hover:bg-[#133863] transition-colors cursor-pointer disabled:opacity-60"
              >
                <Lock className="w-4 h-4" />
                <span>{loading ? 'Verifying…' : 'View My Rewards'}</span>
              </button>
            </form>
          </section>

          {/* Helpful Sidebar Info */}
          <aside className="lg:col-span-5 space-y-5">
            <div className="rounded-2xl bg-white border border-slate-200/80 p-6">
              <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center">
                <Gift className="w-5 h-5 text-[#B4832D]" />
              </div>
              <h2 className="mt-4 text-base font-semibold text-[#0F172A]">
                Don’t have a Client PIN yet?
              </h2>
              <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
                Ask Nilupul via WhatsApp for your personal 4-digit TrueCare Rewards PIN, or refer a friend to start earning points and gift vouchers.
              </p>
              <div className="mt-5 flex flex-col sm:flex-row gap-2.5">
                <a
                  href={buildWhatsAppUrl(
                    'Hello Nilupul, could you please share my 4-digit TrueCare Rewards PIN?'
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 min-h-[44px] px-4 rounded-xl bg-[#0F766E] text-white text-xs font-medium hover:bg-[#115E59] transition-colors whitespace-nowrap"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Request PIN on WhatsApp</span>
                </a>
                <button
                  type="button"
                  onClick={onNavigateToRefer}
                  className="inline-flex items-center justify-center gap-2 min-h-[44px] px-4 rounded-xl border border-slate-200 bg-white text-[#0B2545] text-xs font-medium hover:bg-slate-50 transition-colors whitespace-nowrap cursor-pointer"
                >
                  <UserPlus className="w-4 h-4 text-[#B4832D]" />
                  <span>Refer a Friend</span>
                </button>
              </div>
            </div>
          </aside>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Verified Client Account Summary */}
          <section className="rounded-3xl bg-[#0B2545] text-white p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
              <div>
                <p className="text-xs text-[#E8C574] font-medium">{verifiedData.client.tier}</p>
                <h2 className="mt-1 font-display text-2xl font-semibold text-white">
                  {verifiedData.client.name}
                </h2>
                <p className="mt-0.5 text-xs font-mono-tabular text-slate-300">
                  {verifiedData.client.phone}
                  {verifiedData.client.clientId ? ` · ${verifiedData.client.clientId}` : ''}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={onNavigateToRefer}
                  className="inline-flex items-center justify-center gap-2 min-h-[44px] px-4 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-medium text-white transition-colors whitespace-nowrap cursor-pointer"
                >
                  <UserPlus className="w-4 h-4 text-[#E8C574]" />
                  <span>Refer & Earn More</span>
                </button>
                <button
                  type="button"
                  onClick={handleLockSession}
                  className="inline-flex items-center justify-center gap-1.5 min-h-[44px] px-3.5 rounded-xl border border-white/20 hover:bg-white/10 text-xs font-medium text-slate-200 transition-colors whitespace-nowrap cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Lock</span>
                </button>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <p className="text-xs text-slate-300">Loyalty Points</p>
                <p className="mt-1 font-mono-tabular text-3xl font-semibold text-white">
                  {verifiedData.client.points.toLocaleString('en-LK')}
                </p>
                <p className="mt-1 text-xs text-slate-300">pts available</p>
              </div>

              <div>
                <p className="text-xs text-slate-300">Reward Credits</p>
                <p className="mt-1 font-mono-tabular text-3xl font-semibold text-[#E8C574]">
                  {formatLkr(verifiedData.client.creditsLkr)}
                </p>
                <p className="mt-1 text-xs text-slate-300">earned from referrals</p>
              </div>

              <div>
                <p className="text-xs text-slate-300">Successful Referrals</p>
                <p className="mt-1 font-mono-tabular text-3xl font-semibold text-white">
                  {verifiedData.client.successfulReferrals}
                </p>
                <p className="mt-1 text-xs text-slate-300">policies activated</p>
              </div>
            </div>
          </section>

          {/* Verified Client's Own Rewards & Vouchers */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#0F172A]">Your Gift Vouchers & Rewards</h2>
              <span className="text-xs text-slate-500 tabular-nums">
                {verifiedData.rewards.length} Record{verifiedData.rewards.length === 1 ? '' : 's'}
              </span>
            </div>

            {verifiedData.rewards.length === 0 ? (
              <div className="rounded-2xl bg-white border border-slate-200/80 p-10 text-center">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-center mx-auto">
                  <Gift className="w-6 h-6 text-[#B4832D]" />
                </div>
                <p className="mt-4 text-base font-semibold text-[#0F172A]">
                  No rewards yet — refer a friend to earn gift vouchers and credits!
                </p>
                <button
                  type="button"
                  onClick={onNavigateToRefer}
                  className="mt-5 inline-flex items-center justify-center gap-2 min-h-[44px] px-5 rounded-xl bg-[#0B2545] text-white text-sm font-medium hover:bg-[#133863] transition-colors cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Refer a Friend</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {verifiedData.rewards.map((voucher) => {
                  const isRedeemed = voucher.status === 'Redeemed';
                  const redeemWa = buildWhatsAppUrl(
                    `Hello Nilupul, I would like to claim my TrueCare reward "${voucher.title}" (${
                      voucher.valueLkr > 0 ? formatLkr(voucher.valueLkr) : `${voucher.pointsRequired} pts`
                    }, Code: ${voucher.code}). My registered phone is ${verifiedData.client.phone}.`
                  );

                  return (
                    <article
                      key={voucher.voucherId}
                      className="rounded-2xl bg-white border border-slate-200/80 p-6 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-3 text-xs">
                          <span
                            className={`font-medium ${
                              isRedeemed ? 'text-slate-500' : 'text-[#0F766E]'
                            }`}
                          >
                            Status: {voucher.status}
                          </span>
                          <span className="font-mono-tabular text-slate-500">
                            {voucher.expiryDate}
                          </span>
                        </div>

                        <h3 className="mt-2.5 text-lg font-semibold text-[#0F172A]">
                          {voucher.title}
                        </h3>
                        {voucher.valueLkr > 0 && (
                          <p className="mt-1 font-mono-tabular text-xl font-semibold text-[#B4832D]">
                            {formatLkr(voucher.valueLkr)}
                          </p>
                        )}
                        <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                          {voucher.description}
                        </p>

                        <div className="mt-4 flex items-center justify-between gap-2 rounded-xl bg-slate-50 border border-slate-200/80 px-3.5 py-2.5">
                          <div>
                            <p className="text-[11px] text-slate-500">Voucher / Reward Code</p>
                            <p className="font-mono-tabular text-sm font-semibold text-[#0B2545]">
                              {voucher.code}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleCopyCode(voucher.code)}
                            className="inline-flex items-center gap-1.5 min-h-[36px] px-3 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
                          >
                            {copiedCode === voucher.code ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-[#0F766E]" />
                                <span>Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {!isRedeemed && (
                        <div className="mt-5 flex flex-col sm:flex-row gap-2.5">
                          <a
                            href={redeemWa}
                            target="_blank"
                            rel="noreferrer"
                            className="flex-1 inline-flex items-center justify-center gap-2 min-h-[44px] px-4 rounded-xl bg-[#0F766E] text-white text-sm font-medium hover:bg-[#115E59] transition-colors whitespace-nowrap"
                          >
                            <MessageCircle className="w-4 h-4" />
                            <span>Claim on WhatsApp</span>
                          </a>
                          <button
                            type="button"
                            onClick={() =>
                              onOpenEmail(
                                `Voucher Claim Request: ${voucher.code}`,
                                `Hello Nilupul,\n\nI would like to claim my TrueCare reward:\nReward: ${voucher.title}\nCode: ${voucher.code}\nRegistered Phone: ${verifiedData.client.phone}\n\nThank you.`
                              )
                            }
                            className="inline-flex items-center justify-center gap-2 min-h-[44px] px-4 rounded-xl border border-slate-200 bg-white text-[#0B2545] text-sm font-medium hover:bg-slate-50 transition-colors whitespace-nowrap cursor-pointer"
                          >
                            <Mail className="w-4 h-4 text-[#B4832D]" />
                            <span>Email Claim</span>
                          </button>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
};
