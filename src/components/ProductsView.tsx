import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  GraduationCap,
  HeartPulse,
  Mail,
  MessageCircle,
  Phone,
  PiggyBank,
  Search,
  Shield,
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

function CategoryIllustration({ category }: { category: ProductCategory }) {
  const config: Record<
    ProductCategory,
    { bg: string; iconColor: string; Icon: React.FC<{ className?: string }> }
  > = {
    Education: { bg: 'bg-[#0B2545]/5', iconColor: 'text-[#0B2545]', Icon: GraduationCap },
    'Life Insurance': { bg: 'bg-[#B4832D]/10', iconColor: 'text-[#9A6E22]', Icon: Shield },
    Health: { bg: 'bg-[#0F766E]/10', iconColor: 'text-[#0F766E]', Icon: HeartPulse },
    Savings: { bg: 'bg-slate-100', iconColor: 'text-slate-700', Icon: PiggyBank },
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
      <div className="h-44 sm:h-48 w-full overflow-hidden bg-slate-100 border-b border-slate-100">
        <img
          src={product.imageUrl}
          alt={`${product.productName} — ${product.category}`}
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          className="w-full h-full object-cover"
        />
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
          className="inline-flex items-center gap-2 min-h-[44px] px-3 -ml-3 rounded-xl text-sm font-medium text-slate-600 hover:text-[#0B2545] hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Products</span>
        </button>

        <article className="rounded-3xl bg-white border border-slate-200/80 overflow-hidden shadow-xs">
          <ProductBanner product={selectedProduct} />

          <div className="p-6 sm:p-8 lg:p-10">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <CategoryIllustration category={selectedProduct.category} />
                <div>
                  <p className="text-xs text-slate-500">
                    <span>{selectedProduct.category}</span>
                    <span className="mx-1.5" aria-hidden="true">·</span>
                    <span>{selectedProduct.status}</span>
                    <span className="mx-1.5" aria-hidden="true">·</span>
                    <span className="font-mono-tabular">{selectedProduct.productId}</span>
                  </p>
                  <h1 className="mt-1 font-display text-2xl sm:text-3xl font-semibold text-[#0B2545]">
                    {selectedProduct.productName}
                  </h1>
                  <p className="mt-2 text-[15px] text-slate-600 max-w-2xl leading-relaxed">
                    {selectedProduct.shortTagline}
                  </p>
                </div>
              </div>
            </div>

            {/* Key Facts Row */}
            <dl className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-4 py-5 border-y border-slate-100">
              <div>
                <dt className="text-xs font-medium text-slate-500">Eligibility</dt>
                <dd className="mt-1 text-sm font-medium text-[#0F172A]">
                  {selectedProduct.eligibility}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-slate-500">Payment Flexibility</dt>
                <dd className="mt-1 text-sm font-medium text-[#0F172A]">
                  {selectedProduct.paymentOptions}
                </dd>
              </div>
            </dl>

            {/* Detailed Benefits Breakdown */}
            <div className="mt-7">
              <h2 className="text-base font-semibold text-[#0F172A]">
                Detailed Plan Benefits
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Key protection and maturity advantages structured under this HNB Life solution.
              </p>

              <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedProduct.detailedBenefits.map((benefit, idx) => (
                  <div
                    key={`${benefit.title}-${idx}`}
                    className="rounded-2xl bg-slate-50/80 border border-slate-200/70 p-5"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#0B2545] text-white flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-[#0F172A]">{benefit.title}</h3>
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
                className="inline-flex items-center justify-center gap-2 min-h-[48px] px-5 rounded-xl bg-[#0F766E] text-white text-sm font-medium hover:bg-[#115E59] transition-colors whitespace-nowrap"
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
                className="inline-flex items-center justify-center gap-2 min-h-[48px] px-5 rounded-xl bg-[#0B2545] text-white text-sm font-medium hover:bg-[#133863] transition-colors whitespace-nowrap cursor-pointer"
              >
                <Mail className="w-4 h-4" />
                <span>Email Nilupul</span>
              </button>

              <a
                href={ADVISOR.phoneTel}
                className="inline-flex items-center justify-center gap-2 min-h-[48px] px-4 rounded-xl border border-slate-200 bg-white text-[#0B2545] text-sm font-medium hover:bg-slate-50 transition-colors whitespace-nowrap"
              >
                <Phone className="w-4 h-4 text-[#B4832D]" />
                <span className="tabular-nums">Call {ADVISOR.phoneDisplay}</span>
              </a>

              <button
                type="button"
                onClick={() => onReferProduct(selectedProduct.productName)}
                className="inline-flex items-center justify-center gap-2 min-h-[48px] px-4 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors whitespace-nowrap cursor-pointer"
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
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-[#B4832D]">HNB Life Portfolio</p>
          <h1 className="mt-1 font-display text-2xl sm:text-3xl font-semibold text-[#0B2545]">
            Products & Benefits
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
            className="w-full min-h-[44px] pl-10 pr-9 rounded-xl border border-slate-200 bg-white text-sm text-[#0F172A] placeholder:text-slate-400 focus:border-[#0B2545] focus:outline-none"
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

      {/* Category Filter Segmented Control */}
      <div
        role="tablist"
        aria-label="Filter products by category"
        className="flex items-center gap-1.5 overflow-x-auto pb-1 -mx-1 px-1"
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
              className={`min-h-[40px] px-4 py-2 rounded-xl text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                active
                  ? 'bg-[#0B2545] text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:text-[#0B2545] hover:border-slate-300'
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      {/* Product Cards Grid */}
      {filteredProducts.length === 0 ? (
        <div className="rounded-2xl bg-white border border-slate-200/80 p-10 text-center">
          <p className="text-base font-semibold text-[#0F172A]">No matching plans found</p>
          <p className="mt-1 text-sm text-slate-500">
            Try clearing your search term or selecting a different category.
          </p>
          <button
            type="button"
            onClick={() => {
              setActiveCategory('All');
              setSearchQuery('');
            }}
            className="mt-4 min-h-[44px] px-5 rounded-xl bg-[#0B2545] text-sm font-medium text-white hover:bg-[#133863] transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredProducts.map((product) => (
            <article
              key={product.productId}
              className="rounded-2xl bg-white border border-slate-200/80 overflow-hidden flex flex-col justify-between hover:border-slate-300 transition-colors"
            >
              <div>
                <ProductBanner product={product} />
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-xs text-slate-500">
                        <span>{product.category}</span>
                        <span className="mx-1.5" aria-hidden="true">·</span>
                        <span>{product.status}</span>
                        <span className="mx-1.5" aria-hidden="true">·</span>
                        <span className="font-mono-tabular">{product.productId}</span>
                      </p>
                      <h2 className="mt-1.5 text-lg font-semibold text-[#0F172A]">
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
                        <Check className="w-4 h-4 text-[#0F766E] shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="px-6 py-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => onSelectProduct(product)}
                  className="inline-flex items-center gap-1.5 min-h-[44px] text-sm font-semibold text-[#0B2545] hover:text-[#B4832D] transition-colors cursor-pointer"
                >
                  <span>Detailed Benefits</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href={buildWhatsAppUrl(
                    `Hello Nilupul, I am interested in the ${product.productName} (${product.productId}). Please share more details.`
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 min-h-[40px] px-3.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-[#0F766E] hover:bg-emerald-50/40 transition-colors whitespace-nowrap"
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
