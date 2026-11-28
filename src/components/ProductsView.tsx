import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Calculator,
  Check,
  GraduationCap,
  HeartPulse,
  Mail,
  MessageCircle,
  Phone,
  PiggyBank,
  Search,
  Shield,
  Sparkles,
  UserPlus,
  X,
} from 'lucide-react';
import { Product, ProductCategory } from '../types';
import { ADVISOR, buildWhatsAppUrl } from '../data/advisorData';

interface ProductsViewProps {
  products: Product[];
  selectedProduct: Product | null;
  onSelectProduct: (product: Product | null) => void;
  onOpenEmail: (subject?: string, body?: string) => void;
  onReferProduct: (productName: string) => void;
}

const CATEGORIES: Array<'All' | ProductCategory> = [
  'All',
  'Life Insurance',
  'Education',
  'Health',
  'Savings',
];

const ESTIMATOR_GOALS = [
  'Child Higher Education',
  'Family Life Protection',
  'Cashless Health Cover',
  'Retirement & Wealth',
];

const ESTIMATOR_BUDGETS = [
  'Rs. 10,000 / mo',
  'Rs. 25,000 / mo',
  'Rs. 50,000 / mo',
  'Rs. 100,000+ / mo',
];

function CategoryIllustration({ category }: { category: ProductCategory }) {
  const config: Record<
    ProductCategory,
    { bg: string; iconColor: string; Icon: React.FC<{ className?: string }> }
  > = {
    Education: { bg: 'bg-[#0B2545]/8', iconColor: 'text-[#0B2545]', Icon: GraduationCap },
    'Life Insurance': { bg: 'bg-amber-50 border border-amber-200/70', iconColor: 'text-[#9A6E22]', Icon: Shield },
    Health: { bg: 'bg-emerald-50 border border-emerald-200/70', iconColor: 'text-[#0F766E]', Icon: HeartPulse },
    Savings: { bg: 'bg-slate-100 border border-slate-200/70', iconColor: 'text-[#0B2545]', Icon: PiggyBank },
  };
  const { bg, iconColor, Icon } = config[category];
  return (
    <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
      <Icon className={`w-5 h-5 ${iconColor}`} />
    </div>
  );
}

function ProductBanner({ product }: { product: Product }) {
  const [imgError, setImgError] = useState(false);

  if (product.imageUrl && !imgError) {
    return (
      <div className="w-full aspect-[16/10] sm:aspect-[16/9] overflow-hidden bg-[#0B2545]/5 border-b border-slate-100 relative flex items-center justify-center">
        <img
          src={product.imageUrl.trim()}
          alt={`${product.productName} — ${product.category}`}
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
        />
        {product.status === 'Featured' && (
          <span className="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#0B2545]/90 backdrop-blur-xs text-[11px] font-semibold text-[#F3D58D] shadow-xs">
            <Sparkles className="w-3 h-3" />
            <span>Featured Plan</span>
          </span>
        )}
      </div>
    );
  }

  return null;
}

export const ProductsView: React.FC<ProductsViewProps> = ({
  products,
  selectedProduct,
  onSelectProduct,
  onOpenEmail,
  onReferProduct,
}) => {
  const [activeCategory, setActiveCategory] = useState<'All' | ProductCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Quick Plan Estimator State
  const [selectedGoal, setSelectedGoal] = useState<string>(ESTIMATOR_GOALS[0]);
  const [selectedBudget, setSelectedBudget] = useState<string>(ESTIMATOR_BUDGETS[1]);

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return products.filter((product) => {
      const matchesCategory = activeCategory === 'All' || product.category === activeCategory;
      if (!matchesCategory) return false;
      if (!q) return true;
      return (
        product.productName.toLowerCase().includes(q) ||
        product.shortTagline.toLowerCase().includes(q) ||
        product.category.toLowerCase().includes(q) ||
        product.productId.toLowerCase().includes(q) ||
        product.keyBenefits.some((b) => b.toLowerCase().includes(q))
      );
    });
  }, [products, activeCategory, searchQuery]);

  const estimatorWhatsAppUrl = buildWhatsAppUrl(
    `Hello Nilupul, I used the Quick Plan Estimator on TrueCare.\n\n• Primary Goal: ${selectedGoal}\n• Monthly Budget: ${selectedBudget}\n\nPlease suggest the best HNB Life plan and benefit illustration for me.`
  );

  // Separate Detailed Benefits View
  if (selectedProduct) {
    const waInquiryUrl = buildWhatsAppUrl(
      `Hello Nilupul, I would like a tailored quotation and benefit illustration for ${selectedProduct.productName} (${selectedProduct.productId}).`
    );

    return (
      <div className="space-y-6">
        <button
          type="button"
          onClick={() => onSelectProduct(null)}
          className="inline-flex items-center gap-2 min-h-[44px] px-3.5 -ml-2 rounded-xl text-sm font-semibold text-slate-600 hover:text-[#0B2545] hover:bg-white hover:shadow-xs transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Products</span>
        </button>

        <article className="rounded-3xl bg-white border border-slate-200/80 overflow-hidden shadow-[0_12px_40px_-15px_rgba(11,37,69,0.12)]">
          <div className="h-1.5 w-full bg-gradient-to-r from-[#0B2545] via-[#D4A84F] to-[#0B2545]" />
          <ProductBanner product={selectedProduct} />

          <div className="p-6 sm:p-8 lg:p-10">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <CategoryIllustration category={selectedProduct.category} />
                <div>
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200/70 font-semibold text-[#9A6B1C]">
                      {selectedProduct.category}
                    </span>
                    <span className="text-slate-400">·</span>
                    <span className="font-medium text-emerald-700">{selectedProduct.status}</span>
                    <span className="text-slate-400">·</span>
                    <span className="font-mono-tabular text-slate-500">{selectedProduct.productId}</span>
                  </div>
                  <h1 className="mt-2 font-display text-2xl sm:text-3xl font-bold text-[#0B2545]">
                    {selectedProduct.productName}
                  </h1>
                  <p className="mt-2 text-[15px] text-slate-600 max-w-2xl leading-relaxed">
                    {selectedProduct.shortTagline}
                  </p>
                </div>
              </div>
            </div>

            {/* Key Facts Row */}
            <dl className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-2xl bg-slate-50/90 border border-slate-200/70">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-[#B4832D]">
                  Eligibility
                </dt>
                <dd className="mt-1 text-sm font-semibold text-[#0F172A]">
                  {selectedProduct.eligibility}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-[#B4832D]">
                  Payment Flexibility
                </dt>
                <dd className="mt-1 text-sm font-semibold text-[#0F172A]">
                  {selectedProduct.paymentOptions}
                </dd>
              </div>
            </dl>

            {/* Detailed Benefits Breakdown */}
            <div className="mt-8">
              <h2 className="text-base font-bold text-[#0B2545]">
                Detailed Plan Benefits
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Key protection and maturity advantages structured under this HNB Life solution.
              </p>

              <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedProduct.detailedBenefits.map((benefit, idx) => (
                  <div
                    key={`${benefit.title}-${idx}`}
                    className="rounded-2xl bg-white border border-slate-200/80 p-5 shadow-xs hover:border-[#D4A84F]/60 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#0B2545] to-[#163B6B] text-[#F3D58D] flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-[#0F172A]">{benefit.title}</h3>
                        <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
                          {benefit.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Direct Advisor Actions */}
            <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row flex-wrap gap-3">
              <a
                href={waInquiryUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 min-h-[48px] px-5 rounded-xl bg-gradient-to-r from-[#059669] to-[#0F766E] text-white text-sm font-semibold shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] transition-all whitespace-nowrap"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Request Illustration on WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={() =>
                  onOpenEmail(
                    `Quotation Request: ${selectedProduct.productName} (${selectedProduct.productId})`,
                    `Hello Nilupul,\n\nI reviewed the ${selectedProduct.productName} (${selectedProduct.productId}) in the TrueCare app and would like a personalized benefit illustration.\n\nThank you.`
                  )
                }
                className="inline-flex items-center justify-center gap-2 min-h-[48px] px-5 rounded-xl bg-gradient-to-r from-[#0B2545] to-[#163B6B] text-white text-sm font-semibold shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] transition-all whitespace-nowrap cursor-pointer"
              >
                <Mail className="w-4 h-4 text-[#E8C574]" />
                <span>Email Nilupul</span>
              </button>

              <a
                href={ADVISOR.phoneTel}
                className="inline-flex items-center justify-center gap-2 min-h-[48px] px-4 rounded-xl border border-slate-200 bg-white text-[#0B2545] text-sm font-semibold hover:border-[#D4A84F] hover:bg-amber-50/40 transition-all whitespace-nowrap"
              >
                <Phone className="w-4 h-4 text-[#B4832D]" />
                <span className="tabular-nums">Call {ADVISOR.phoneDisplay}</span>
              </a>

              <button
                type="button"
                onClick={() => onReferProduct(selectedProduct.productName)}
                className="inline-flex items-center justify-center gap-2 min-h-[48px] px-4 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-semibold hover:border-[#D4A84F] hover:bg-amber-50/40 transition-all whitespace-nowrap cursor-pointer"
              >
                <UserPlus className="w-4 h-4 text-[#B4832D]" />
                <span>Refer a Friend</span>
              </button>
            </div>
          </div>
        </article>
      </div>
    );
  }

  return (
    <div className="space-y-7">
      {/* Header + Search */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-[11px] font-semibold text-[#9A6B1C] tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-[#D4A84F]" />
            <span>HNB Life Portfolio</span>
          </span>
          <h1 className="mt-2 font-display text-2xl sm:text-3xl font-bold text-[#0B2545]">
            Products &amp; Benefits
          </h1>
          <p className="mt-1.5 text-sm text-slate-600">
            Browse protection, education, health, and savings plans. Select any plan for a complete benefit breakdown.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search plans or benefits…"
            aria-label="Search life insurance products"
            className="w-full min-h-[44px] pl-10 pr-9 rounded-xl border border-slate-200 bg-white text-sm text-[#0F172A] placeholder:text-slate-400 shadow-2xs focus:border-[#0B2545] focus:ring-2 focus:ring-[#0B2545]/10 focus:outline-none transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Interactive Quick Monthly Plan Estimator */}
      <section className="rounded-3xl bg-gradient-to-br from-[#071930] via-[#0B2545] to-[#133863] text-white p-6 sm:p-7 shadow-[0_12px_36px_-14px_rgba(11,37,69,0.35)] relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-16 -right-16 w-56 h-56 rounded-full bg-[#D4A84F]/15 blur-3xl"
        />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-4 flex-1">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/10 border border-[#E8C574]/30 flex items-center justify-center shrink-0">
                <Calculator className="w-4 h-4 text-[#F3D58D]" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white leading-tight">
                  Quick Monthly Plan Estimator
                </h2>
                <p className="text-xs text-slate-300">
                  Select your goal &amp; monthly savings to get a tailored HNB Life illustration.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#E8C574] mb-2">
                  1. Your Primary Goal
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {ESTIMATOR_GOALS.map((goal) => {
                    const active = selectedGoal === goal;
                    return (
                      <button
                        key={goal}
                        type="button"
                        onClick={() => setSelectedGoal(goal)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                          active
                            ? 'bg-[#D4A84F] text-[#071930] font-semibold shadow-xs'
                            : 'bg-white/10 text-slate-200 hover:bg-white/15 border border-white/10'
                        }`}
                      >
                        {goal}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#E8C574] mb-2">
                  2. Monthly Budget
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {ESTIMATOR_BUDGETS.map((budget) => {
                    const active = selectedBudget === budget;
                    return (
                      <button
                        key={budget}
                        type="button"
                        onClick={() => setSelectedBudget(budget)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium tabular-nums transition-all cursor-pointer ${
                          active
                            ? 'bg-white text-[#0B2545] font-semibold shadow-xs'
                            : 'bg-white/10 text-slate-200 hover:bg-white/15 border border-white/10'
                        }`}
                      >
                        {budget}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:w-60 shrink-0 flex flex-col justify-center">
            <a
              href={estimatorWhatsAppUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 min-h-[48px] px-5 rounded-xl bg-gradient-to-r from-[#059669] to-[#0F766E] text-white text-sm font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] transition-all whitespace-nowrap"
            >
              <MessageCircle className="w-4 h-4 shrink-0" />
              <span>Get My Plan on WhatsApp</span>
            </a>
            <p className="mt-2 text-[11px] text-center text-slate-300">
              Free personalized quote from Nilupul
            </p>
          </div>
        </div>
      </section>

      {/* Category Filter Segmented Control */}
      <div
        role="tablist"
        aria-label="Filter products by category"
        className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1"
      >
        {CATEGORIES.map((category) => {
          const active = activeCategory === category;
          return (
            <button
              key={category}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setActiveCategory(category)}
              className={`min-h-[40px] px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                active
                  ? 'bg-[#0B2545] text-[#F3D58D] shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:text-[#0B2545] hover:border-[#D4A84F]/60'
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      {/* Product Cards Grid */}
      {filteredProducts.length === 0 ? (
        <div className="rounded-2xl bg-white border border-slate-200/80 p-10 text-center shadow-xs">
          <p className="text-base font-bold text-[#0F172A]">No matching plans found</p>
          <p className="mt-1 text-sm text-slate-500">
            Try clearing your search term or selecting a different category.
          </p>
          <button
            type="button"
            onClick={() => {
              setActiveCategory('All');
              setSearchQuery('');
            }}
            className="mt-4 min-h-[44px] px-5 rounded-xl bg-[#0B2545] text-sm font-semibold text-white hover:bg-[#133863] transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredProducts.map((product) => (
            <article
              key={product.productId}
              className="group relative rounded-2xl bg-white border border-slate-200/80 overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-lg hover:border-[#D4A84F]/60 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#0B2545] to-[#D4A84F] z-10" />
              <div>
                <ProductBanner product={product} />
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-xs text-slate-500">
                        <span className="font-semibold text-[#9A6B1C]">{product.category}</span>
                        <span className="mx-1.5" aria-hidden="true">·</span>
                        <span>{product.status}</span>
                        <span className="mx-1.5" aria-hidden="true">·</span>
                        <span className="font-mono-tabular">{product.productId}</span>
                      </p>
                      <h2 className="mt-1.5 text-lg font-bold text-[#0F172A] group-hover:text-[#0B2545] transition-colors">
                        {product.productName}
                      </h2>
                    </div>
                    <CategoryIllustration category={product.category} />
                  </div>

                  <p className="mt-2.5 text-sm text-slate-600 leading-relaxed">
                    {product.shortTagline}
                  </p>

                  <ul className="mt-4 space-y-2">
                    {product.keyBenefits.slice(0, 3).map((benefit) => (
                      <li key={benefit} className="flex items-center gap-2 text-sm text-slate-700">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="px-6 py-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => onSelectProduct(product)}
                  className="inline-flex items-center gap-1.5 min-h-[44px] text-sm font-semibold text-[#0B2545] hover:text-[#B4832D] transition-colors cursor-pointer"
                >
                  <span>Detailed Benefits</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <a
                  href={buildWhatsAppUrl(
                    `Hello Nilupul, I am interested in the ${product.productName} (${product.productId}). Please share more details.`
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 min-h-[40px] px-3.5 rounded-xl border border-emerald-200 bg-emerald-50/70 text-xs font-semibold text-[#0F766E] hover:bg-emerald-100/70 transition-colors whitespace-nowrap"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
