import React, { useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  Award,
  Check,
  Copy,
  Eye,
  EyeOff,
  Frown,
  Gift,
  KeyRound,
  Lock,
  LogOut,
  Mail,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
  Trophy,
  UserPlus,
  X,
} from 'lucide-react';
import { ClientRewardsResponse } from '../types';
import { buildWhatsAppUrl } from '../data/advisorData';
import { fetchClientRewards } from '../services/truecareApi';

interface RewardsViewProps {
  initialLookupPhone?: string;
  onNavigateToRefer: () => void;
  onOpenEmail: (subject?: string, body?: string) => void;
}

interface CelebrationProps {
  clientName: string;
  activeVouchersCount: number;
  creditsLkr: number;
  points: number;
  onClose: () => void;
}

interface NoRewardsPromptProps {
  clientName: string;
  onClose: () => void;
  onReferNow: () => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  decay: number;
  color: string;
  size: number;
}

interface Raindrop {
  x: number;
  y: number;
  length: number;
  speed: number;
  opacity: number;
}

const FIREWORK_COLORS = ['#F3D58D', '#D4A84F', '#10B981', '#38BDF8', '#FBBF24', '#FFFFFF'];

const FireworksCelebration: React.FC<CelebrationProps> = ({
  clientName,
  activeVouchersCount,
  creditsLkr,
  points,
  onClose,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const autoCloseTimer = window.setTimeout(() => {
      onClose();
    }, 7500);

    const canvas = canvasRef.current;
    if (!canvas) {
      return () => window.clearTimeout(autoCloseTimer);
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return () => window.clearTimeout(autoCloseTimer);
    }

    let animationFrameId = 0;
    const particles: Particle[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const spawnBurst = (cx: number, cy: number) => {
      const count = 42;
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.25;
        const speed = 2.2 + Math.random() * 5.2;
        particles.push({
          x: cx,
          y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          decay: 0.012 + Math.random() * 0.014,
          color: FIREWORK_COLORS[Math.floor(Math.random() * FIREWORK_COLORS.length)],
          size: 2 + Math.random() * 2.5,
        });
      }
    };

    spawnBurst(window.innerWidth * 0.25, window.innerHeight * 0.3);
    spawnBurst(window.innerWidth * 0.75, window.innerHeight * 0.28);
    spawnBurst(window.innerWidth * 0.5, window.innerHeight * 0.22);

    const burstInterval = window.setInterval(() => {
      const rx = window.innerWidth * (0.18 + Math.random() * 0.64);
      const ry = window.innerHeight * (0.15 + Math.random() * 0.42);
      spawnBurst(rx, ry);
    }, 650);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.06;
        p.vx *= 0.985;
        p.vy *= 0.985;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = window.requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.clearTimeout(autoCloseTimer);
      window.clearInterval(burstInterval);
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Reward Congratulations"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#071930]/80 backdrop-blur-sm"
    >
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none w-full h-full"
      />

      <div className="relative z-10 w-full max-w-md rounded-3xl bg-gradient-to-b from-[#0B2545] to-[#071930] border border-[#E8C574]/40 p-7 sm:p-8 text-center text-white shadow-[0_24px_60px_-15px_rgba(0,0,0,0.65)]">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close celebration"
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-200 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#F3D58D] to-[#B4832D] flex items-center justify-center mx-auto shadow-lg shadow-[#D4A84F]/30 animate-bounce">
          <Trophy className="w-8 h-8 text-[#071930]" />
        </div>

        <span className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-[#E8C574]/30 text-[11px] font-semibold text-[#F3D58D] tracking-wide">
          <Sparkles className="w-3.5 h-3.5" />
          <span>TrueCare Client Reward Unlocked</span>
        </span>

        <h2 className="mt-3 font-display text-2xl sm:text-3xl font-bold text-white">
          Congratulations, {clientName}! 🎉
        </h2>

        <p className="mt-2 text-sm text-slate-300 leading-relaxed">
          Thank you for trusting <span className="text-[#F3D58D] font-semibold">TrueCare with Nilupul</span>. Your exclusive rewards are ready to claim!
        </p>

        <div className="mt-5 grid grid-cols-3 gap-2.5">
          <div className="rounded-xl bg-white/[0.07] border border-white/10 p-3">
            <p className="text-[10px] uppercase tracking-wider text-slate-300">Vouchers</p>
            <p className="mt-1 font-mono-tabular text-lg font-bold text-[#F3D58D]">
              {activeVouchersCount}
            </p>
          </div>
          <div className="rounded-xl bg-white/[0.07] border border-white/10 p-3">
            <p className="text-[10px] uppercase tracking-wider text-slate-300">Credits</p>
            <p className="mt-1 font-mono-tabular text-sm font-bold text-emerald-300">
              LKR {creditsLkr.toLocaleString('en-LK')}
            </p>
          </div>
          <div className="rounded-xl bg-white/[0.07] border border-white/10 p-3">
            <p className="text-[10px] uppercase tracking-wider text-slate-300">Points</p>
            <p className="mt-1 font-mono-tabular text-lg font-bold text-white">
              {points.toLocaleString('en-LK')}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full inline-flex items-center justify-center gap-2 min-h-[48px] px-6 rounded-xl bg-gradient-to-r from-[#D4A84F] to-[#F3D58D] text-[#071930] text-sm font-bold shadow-md hover:brightness-105 active:scale-[0.98] transition-all cursor-pointer"
        >
          <Gift className="w-4 h-4" />
          <span>View My Rewards</span>
        </button>
      </div>
    </div>
  );
};

const NoRewardsPrompt: React.FC<NoRewardsPromptProps> = ({
  clientName,
  onClose,
  onReferNow,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId = 0;
    const drops: Raindrop[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < 65; i++) {
      drops.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        length: 12 + Math.random() * 18,
        speed: 3 + Math.random() * 4.5,
        opacity: 0.15 + Math.random() * 0.35,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const d of drops) {
        d.y += d.speed;
        if (d.y > canvas.height) {
          d.y = -d.length;
          d.x = Math.random() * canvas.width;
        }

        ctx.strokeStyle = `rgba(148, 163, 184, ${d.opacity})`;
        ctx.lineWidth = 1.4;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x - 1.5, d.y + d.length);
        ctx.stroke();
      }

      animationFrameId = window.requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="No Rewards Earned Yet"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#071930]/80 backdrop-blur-sm"
    >
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none w-full h-full"
      />

      <div className="relative z-10 w-full max-w-md rounded-3xl bg-gradient-to-b from-[#0F294A] to-[#071930] border border-slate-500/30 p-7 sm:p-8 text-center text-white shadow-[0_24px_60px_-15px_rgba(0,0,0,0.65)]">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close message"
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-16 h-16 rounded-2xl bg-slate-800/90 border border-slate-600/50 flex items-center justify-center mx-auto shadow-inner animate-pulse">
          <Frown className="w-8 h-8 text-slate-300" />
        </div>

        <span className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-600/40 text-[11px] font-semibold text-slate-300 tracking-wide">
          <span>Your Rewards Vault Is Empty</span>
        </span>

        <h2 className="mt-3 font-display text-2xl sm:text-3xl font-bold text-white">
          Aww, No Rewards Yet, {clientName} 😔
        </h2>

        <p className="mt-2.5 text-sm text-slate-300 leading-relaxed">
          Don’t miss out! <span className="text-[#F3D58D] font-semibold">Hurry up</span> — refer a friend or family member to TrueCare today and start earning <span className="text-emerald-300 font-semibold">extra LKR credits, loyalty points &amp; gift vouchers!</span>
        </p>

        <div className="mt-6 flex flex-col gap-2.5">
          <button
            type="button"
            onClick={() => {
              onClose();
              onReferNow();
            }}
            className="w-full inline-flex items-center justify-center gap-2 min-h-[48px] px-6 rounded-xl bg-gradient-to-r from-[#D4A84F] to-[#F3D58D] text-[#071930] text-sm font-bold shadow-md hover:brightness-105 active:scale-[0.98] transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Refer a Friend &amp; Earn Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full min-h-[42px] px-4 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            View My Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

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
  const [popupMode, setPopupMode] = useState<'none' | 'celebration' | 'no-rewards'>('none');
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

      const hasActiveVouchers = response.rewards.some((v) => v.status !== 'Redeemed');
      const hasEarnedRewards =
        hasActiveVouchers ||
        response.client.creditsLkr > 0 ||
        response.client.points > 0 ||
        response.rewards.length > 0;

      setPopupMode(hasEarnedRewards ? 'celebration' : 'no-rewards');
    } catch (err: unknown) {
      setVerifiedData(null);
      setPopupMode('none');
      const msg = err instanceof Error ? err.message : 'Invalid Phone Number or PIN';
      setErrorMsg(msg || 'Invalid Phone Number or PIN');
    } finally {
      setLoading(false);
    }
  };

  const handleLockSession = () => {
    setVerifiedData(null);
    setPopupMode('none');
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

  const activeVouchersCount = verifiedData
    ? verifiedData.rewards.filter((v) => v.status !== 'Redeemed').length
    : 0;

  return (
    <div className="space-y-7">
      {popupMode === 'celebration' && verifiedData && (
        <FireworksCelebration
          clientName={verifiedData.client.name}
          activeVouchersCount={activeVouchersCount}
          creditsLkr={verifiedData.client.creditsLkr}
          points={verifiedData.client.points}
          onClose={() => setPopupMode('none')}
        />
      )}

      {popupMode === 'no-rewards' && verifiedData && (
        <NoRewardsPrompt
          clientName={verifiedData.client.name}
          onClose={() => setPopupMode('none')}
          onReferNow={onNavigateToRefer}
        />
      )}

      {/* Header */}
      <div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-[11px] font-semibold text-[#9A6B1C] tracking-wide">
          <Sparkles className="w-3.5 h-3.5 text-[#D4A84F]" />
          <span>PIN-Protected Client Portal</span>
        </span>
        <h1 className="mt-2 font-display text-2xl sm:text-3xl font-bold text-[#0B2545]">
          Client Rewards &amp; Vouchers
        </h1>
        <p className="mt-1.5 text-sm text-slate-600 max-w-2xl">
          Verify with your registered phone number and 4-digit client PIN to privately view your loyalty points, LKR credits, and claimable gift vouchers.
        </p>
      </div>

      {!verifiedData ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* PIN Verification Form */}
          <section className="lg:col-span-7 relative rounded-3xl bg-white border border-slate-200/80 overflow-hidden shadow-[0_12px_36px_-15px_rgba(11,37,69,0.12)]">
            <div className="h-1.5 w-full bg-gradient-to-r from-[#0B2545] via-[#D4A84F] to-[#0B2545]" />

            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-3.5 pb-5 border-b border-slate-100">
                <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-200/70 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5 text-[#B4832D]" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#0B2545]">Verify Your Identity</h2>
                  <p className="text-xs text-slate-500">
                    Your reward records stay private and are unlocked only with your personal PIN.
                  </p>
                </div>
              </div>

              <form onSubmit={handleVerify} className="mt-6 space-y-5">
                <div>
                  <label
                    htmlFor="rewards-phone"
                    className="block text-xs font-semibold text-slate-700 mb-1.5"
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
                      className="w-full min-h-[48px] pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50/60 text-sm text-[#0F172A] focus:bg-white focus:border-[#0B2545] focus:ring-2 focus:ring-[#0B2545]/10 focus:outline-none tabular-nums transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="rewards-pin"
                    className="block text-xs font-semibold text-slate-700 mb-1.5"
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
                      className="w-full min-h-[48px] pl-10 pr-12 rounded-xl border border-slate-200 bg-slate-50/60 text-sm text-[#0F172A] tracking-[0.3em] font-mono-tabular focus:bg-white focus:border-[#0B2545] focus:ring-2 focus:ring-[#0B2545]/10 focus:outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPin((prev) => !prev)}
                      aria-label={showPin ? 'Hide PIN' : 'Show PIN'}
                      className="absolute right-2 top-1/2 -translate-y-1/2 min-h-[40px] min-w-[40px] flex items-center justify-center text-slate-400 hover:text-[#0B2545] cursor-pointer"
                    >
                      {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {errorMsg && (
                  <div
                    role="alert"
                    className="flex items-start gap-2.5 rounded-xl bg-red-50 border border-red-200 px-3.5 py-3 text-xs font-semibold text-red-700"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 min-h-[50px] px-6 rounded-xl bg-gradient-to-r from-[#0B2545] to-[#163B6B] text-white text-sm font-semibold shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-60"
                >
                  <Lock className="w-4 h-4 text-[#E8C574]" />
                  <span>{loading ? 'Verifying…' : 'View My Rewards'}</span>
                </button>
              </form>
            </div>
          </section>

          {/* Helpful Sidebar Info */}
          <aside className="lg:col-span-5 space-y-5">
            <div className="rounded-3xl bg-gradient-to-br from-white to-amber-50/40 border border-slate-200/80 p-6 sm:p-7 shadow-xs">
              <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-center">
                <Gift className="w-5 h-5 text-[#B4832D]" />
              </div>
              <h2 className="mt-4 text-base font-bold text-[#0B2545]">
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
                  className="flex-1 inline-flex items-center justify-center gap-2 min-h-[46px] px-4 rounded-xl bg-gradient-to-r from-[#059669] to-[#0F766E] text-white text-xs font-semibold shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all whitespace-nowrap"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Request PIN on WhatsApp</span>
                </a>
                <button
                  type="button"
                  onClick={onNavigateToRefer}
                  className="inline-flex items-center justify-center gap-2 min-h-[46px] px-4 rounded-xl border border-slate-200 bg-white text-[#0B2545] text-xs font-semibold hover:border-[#D4A84F] hover:bg-amber-50/40 transition-all whitespace-nowrap cursor-pointer"
                >
                  <UserPlus className="w-4 h-4 text-[#B4832D]" />
                  <span>Refer a Friend</span>
                </button>
              </div>
            </div>
          </aside>
        </div>
      ) : (
        <div className="space-y-7">
          {/* Verified Client Account Summary */}
          <section className="rounded-3xl bg-gradient-to-br from-[#071930] via-[#0B2545] to-[#133863] text-white p-6 sm:p-8 shadow-[0_12px_40px_-14px_rgba(11,37,69,0.4)] relative overflow-hidden">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-20 -right-20 w-64 h-64 rounded-full bg-[#D4A84F]/15 blur-3xl"
            />
            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 border border-[#E8C574]/30 text-[11px] font-semibold text-[#F3D58D]">
                    <Award className="w-3 h-3" />
                    <span>{verifiedData.client.tier}</span>
                  </span>
                  <h2 className="mt-2 font-display text-2xl sm:text-3xl font-bold text-white">
                    {verifiedData.client.name}
                  </h2>
                  <p className="mt-1 text-xs font-mono-tabular text-slate-300">
                    {verifiedData.client.phone}
                    {verifiedData.client.clientId ? ` · ${verifiedData.client.clientId}` : ''}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={onNavigateToRefer}
                    className="inline-flex items-center justify-center gap-2 min-h-[44px] px-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-semibold text-white transition-all whitespace-nowrap cursor-pointer"
                  >
                    <UserPlus className="w-4 h-4 text-[#F3D58D]" />
                    <span>Refer &amp; Earn More</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleLockSession}
                    className="inline-flex items-center justify-center gap-1.5 min-h-[44px] px-3.5 rounded-xl border border-white/20 hover:bg-white/10 text-xs font-semibold text-slate-200 transition-all whitespace-nowrap cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Lock</span>
                  </button>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-2xl bg-white/[0.06] border border-white/[0.08] p-4 backdrop-blur-xs">
                  <p className="text-xs text-slate-300">Loyalty Points</p>
                  <p className="mt-1 font-mono-tabular text-3xl font-bold text-white">
                    {verifiedData.client.points.toLocaleString('en-LK')}
                  </p>
                  <p className="mt-1 text-xs text-slate-300">pts available</p>
                </div>

                <div className="rounded-2xl bg-white/[0.06] border border-[#E8C574]/25 p-4 backdrop-blur-xs">
                  <p className="text-xs text-slate-300">Reward Credits</p>
                  <p className="mt-1 font-mono-tabular text-3xl font-bold text-[#F3D58D]">
                    {formatLkr(verifiedData.client.creditsLkr)}
                  </p>
                  <p className="mt-1 text-xs text-slate-300">earned from referrals</p>
                </div>

                <div className="rounded-2xl bg-white/[0.06] border border-white/[0.08] p-4 backdrop-blur-xs">
                  <p className="text-xs text-slate-300">Successful Referrals</p>
                  <p className="mt-1 font-mono-tabular text-3xl font-bold text-white">
                    {verifiedData.client.successfulReferrals}
                  </p>
                  <p className="mt-1 text-xs text-slate-300">policies activated</p>
                </div>
              </div>
            </div>
          </section>

          {/* Verified Client's Own Rewards & Vouchers */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#0B2545]">Your Gift Vouchers &amp; Rewards</h2>
              <span className="px-2.5 py-1 rounded-full bg-slate-100 text-xs font-semibold text-slate-600 tabular-nums">
                {verifiedData.rewards.length} Record{verifiedData.rewards.length === 1 ? '' : 's'}
              </span>
            </div>

            {verifiedData.rewards.length === 0 ? (
              <div className="rounded-3xl bg-white border border-slate-200/80 p-10 text-center shadow-xs">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200/70 flex items-center justify-center mx-auto">
                  <Gift className="w-6 h-6 text-[#B4832D]" />
                </div>
                <p className="mt-4 text-base font-bold text-[#0B2545]">
                  No rewards yet — refer a friend to earn gift vouchers and credits!
                </p>
                <button
                  type="button"
                  onClick={onNavigateToRefer}
                  className="mt-5 inline-flex items-center justify-center gap-2 min-h-[46px] px-5 rounded-xl bg-gradient-to-r from-[#0B2545] to-[#163B6B] text-white text-sm font-semibold shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer"
                >
                  <UserPlus className="w-4 h-4 text-[#E8C574]" />
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
                      className="group relative rounded-2xl bg-white border border-slate-200/80 p-6 flex flex-col justify-between shadow-xs hover:shadow-lg hover:border-[#D4A84F]/60 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                    >
                      <div
                        className={`absolute top-0 inset-x-0 h-1 bg-gradient-to-r ${
                          isRedeemed
                            ? 'from-slate-300 to-slate-400'
                            : 'from-[#B4832D] to-[#F59E0B]'
                        }`}
                      />

                      <div>
                        <div className="flex items-center justify-between gap-3 text-xs">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-semibold ${
                              isRedeemed
                                ? 'bg-slate-100 text-slate-600'
                                : 'bg-emerald-50 text-emerald-800 border border-emerald-200/70'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                isRedeemed ? 'bg-slate-400' : 'bg-emerald-500'
                              }`}
                            />
                            <span>{voucher.status}</span>
                          </span>
                          <span className="font-mono-tabular text-slate-500">
                            {voucher.expiryDate}
                          </span>
                        </div>

                        <h3 className="mt-3 text-lg font-bold text-[#0F172A]">
                          {voucher.title}
                        </h3>
                        {voucher.valueLkr > 0 && (
                          <p className="mt-1 font-mono-tabular text-xl font-bold text-[#B4832D]">
                            {formatLkr(voucher.valueLkr)}
                          </p>
                        )}
                        <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                          {voucher.description}
                        </p>

                        <div className="mt-4 flex items-center justify-between gap-2 rounded-xl bg-slate-50 border border-dashed border-slate-300 px-3.5 py-2.5">
                          <div>
                            <p className="text-[11px] font-medium text-slate-500">
                              Voucher / Reward Code
                            </p>
                            <p className="font-mono-tabular text-sm font-bold text-[#0B2545]">
                              {voucher.code}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleCopyCode(voucher.code)}
                            className="inline-flex items-center gap-1.5 min-h-[36px] px-3 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:border-[#D4A84F] hover:text-[#0B2545] transition-colors cursor-pointer"
                          >
                            {copiedCode === voucher.code ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                <span className="text-emerald-700">Copied</span>
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
                        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-2.5">
                          <a
                            href={redeemWa}
                            target="_blank"
                            rel="noreferrer"
                            className="flex-1 inline-flex items-center justify-center gap-2 min-h-[46px] px-4 rounded-xl bg-gradient-to-r from-[#059669] to-[#0F766E] text-white text-sm font-semibold shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all whitespace-nowrap"
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
                            className="inline-flex items-center justify-center gap-2 min-h-[46px] px-4 rounded-xl border border-slate-200 bg-white text-[#0B2545] text-sm font-semibold hover:border-[#D4A84F] hover:bg-amber-50/40 transition-all whitespace-nowrap cursor-pointer"
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
