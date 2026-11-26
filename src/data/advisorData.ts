import {
  BenefitDetail,
  ClientRecord,
  EventOffer,
  Product,
  ProductCategory,
  ReferralRecord,
  RewardVoucher,
  TrueCareDataset,
} from '../types';

export const DEFAULT_ADVISOR_PHOTO = '/assets/aistudio/IMG-20261120-WA0000_0c3d87d7.jpg';

export const ADVISOR = {
  appName: 'TrueCare Nilupul Lokuhewage',
  shortBrand: 'TrueCare',
  fullName: 'Nilupul Thisarinda Lokuhewage',
  displayName: 'Nilupul Lokuhewage',
  role: 'Senior Field Executive & Team Manager',
  company: 'HNB Life',
  phoneDisplay: '071 941 4247',
  phoneRaw: '0719414247',
  phoneTel: 'tel:+94719414247',
  whatsappDisplay: '071 227 9963',
  whatsappRaw: '0712279963',
  whatsappNumber: '94712279963',
  email: 'nilupullokuhewage99hnba@gmail.com',
  location: 'Sri Lanka',
  bio: 'Dedicated to helping Sri Lankan families build lasting financial certainty through tailored HNB Life protection, child higher-education planning, medical security, and structured wealth accumulation.',
  servicePromise: [
    'Transparent policy comparisons tailored to your family budget',
    'Dedicated claims guidance and annual policy reviews',
    'Direct WhatsApp and phone support whenever you need clarity',
  ],
};

export function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${ADVISOR.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('94') && digits.length >= 11) {
    return '0' + digits.slice(2);
  }
  if (digits.length === 9 && digits.startsWith('7')) {
    return '0' + digits;
  }
  return digits;
}

export function normalizeCategory(raw: string): ProductCategory {
  const lower = (raw || '').trim().toLowerCase();
  if (lower.includes('edu') || lower.includes('child')) return 'Education';
  if (lower.includes('health') || lower.includes('med') || lower.includes('hosp')) return 'Health';
  if (lower.includes('sav') || lower.includes('retire') || lower.includes('wealth') || lower.includes('invest')) return 'Savings';
  return 'Life Insurance';
}

export function expandBenefitDetails(benefits: string[], category: ProductCategory): BenefitDetail[] {
  const descriptionMap: Record<string, string> = {
    'guaranteed maturity benefits': 'Receive a structured lump-sum maturity payout timed precisely for university tuition or major family milestones.',
    'child protection': 'Waiver of future premiums ensures your child’s education fund stays fully funded even in the event of an unexpected loss.',
    'flexible payment options': 'Choose monthly, quarterly, semi-annual, or annual premium schedules aligned with your household cash flow.',
  };

  return benefits.map((item) => {
    const clean = item.trim();
    const matched = descriptionMap[clean.toLowerCase()];
    if (matched) {
      return { title: clean, description: matched };
    }
    const categoryNote: Record<ProductCategory, string> = {
      Education: 'Designed to safeguard academic continuity and higher-education funding without disrupting family savings.',
      'Life Insurance': 'Provides dependable financial protection and income replacement for your loved ones.',
      Health: 'Helps offset hospitalisation, surgical, and critical care expenses with cashless or fast-reimbursement support.',
      Savings: 'Builds disciplined medium-to-long-term capital with guaranteed life cover throughout the term.',
    };
    return {
      title: clean,
      description: categoryNote[category],
    };
  });
}

export function parseCsvRows(csvText: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = '';
  let inQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const ch = csvText[i];
    const next = csvText[i + 1];

    if (inQuotes) {
      if (ch === '"' && next === '"') {
        currentCell += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        currentCell += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ',') {
      currentRow.push(currentCell.trim());
      currentCell = '';
    } else if (ch === '\r' && next === '\n') {
      currentRow.push(currentCell.trim());
      if (currentRow.some((cell) => cell.length > 0)) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentCell = '';
      i++;
    } else if (ch === '\n' || ch === '\r') {
      currentRow.push(currentCell.trim());
      if (currentRow.some((cell) => cell.length > 0)) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentCell = '';
    } else {
      currentCell += ch;
    }
  }

  if (currentCell.length > 0 || currentRow.length > 0) {
    currentRow.push(currentCell.trim());
    if (currentRow.some((cell) => cell.length > 0)) {
      rows.push(currentRow);
    }
  }

  return rows;
}

export const STARTER_PRODUCTS: Product[] = [
  {
    productId: 'P01',
    productName: 'Child Education Plan',
    category: 'Education',
    shortTagline: "Secure your child's higher education dreams",
    keyBenefits: ['Guaranteed maturity benefits', 'Child Protection', 'Flexible Payment Options'],
    detailedBenefits: [
      {
        title: 'Guaranteed Maturity Benefits',
        description: 'Receive a planned lump-sum fund or milestone payouts aligned with A/L, local university, or overseas degree fees.',
      },
      {
        title: 'Child Protection & Premium Waiver',
        description: 'In the event of premature loss or total disability of the parent, future premiums are waived while the child still receives the full maturity fund.',
      },
      {
        title: 'Flexible Payment Options',
        description: 'Pay monthly, quarterly, half-yearly, or annually with adaptable policy terms from 10 to 25 years.',
      },
      {
        title: 'Annual Bonus Accumulation',
        description: 'Boost long-term education capital through declared dividends and loyalty additions over the policy term.',
      },
    ],
    eligibility: 'Parents aged 18–55 with children aged 0–15 years',
    paymentOptions: 'Monthly, Quarterly, Semi-Annual, or Annual',
    status: 'Active',
  },
  {
    productId: 'P02',
    productName: 'Family Life Shield',
    category: 'Life Insurance',
    shortTagline: 'Comprehensive income protection and lifelong peace of mind for your household',
    keyBenefits: ['High Life Cover', 'Accidental & Disability Riders', 'Family Income Benefit'],
    detailedBenefits: [
      {
        title: 'Substantial Life Cover',
        description: 'Immediate financial cushion protecting mortgage commitments, household bills, and dependents from day one.',
      },
      {
        title: 'Accidental & Total Disability Riders',
        description: 'Optional enhanced protection covering accidental injury, permanent disability, and loss of earning capacity.',
      },
      {
        title: 'Family Income Benefit',
        description: 'Option to receive regular monthly family income payouts in addition to the core lump-sum benefit.',
      },
      {
        title: 'Loan & Emergency Liquidity',
        description: 'Access accumulated policy values after qualifying years if an urgent household financial need arises.',
      },
    ],
    eligibility: 'Adults aged 18–60 years',
    paymentOptions: 'Monthly, Quarterly, Semi-Annual, or Annual',
    status: 'Featured',
  },
  {
    productId: 'P03',
    productName: 'MediCare Plus Health Cover',
    category: 'Health',
    shortTagline: 'Cashless hospitalisation and critical illness protection for the entire family',
    keyBenefits: ['In-Patient Hospitalisation', '35+ Critical Illnesses Covered', 'Daily Hospital Cash'],
    detailedBenefits: [
      {
        title: 'In-Patient Hospitalisation & Surgery',
        description: 'Covers room charges, specialist fees, theatre costs, and diagnostic scans at leading Sri Lankan private hospitals.',
      },
      {
        title: 'Critical Illness Lump Sum',
        description: 'Direct cash payout upon diagnosis of major covered illnesses including cardiac, oncology, and neurological conditions.',
      },
      {
        title: 'Daily Hospital Cash Allowance',
        description: 'Daily per-diem benefit during hospital stays to cover incidental family expenses and recovery support.',
      },
      {
        title: 'Family Floater Extension',
        description: 'Extend seamless protection to your spouse and children under one manageable plan.',
      },
    ],
    eligibility: 'Individuals and families aged 18–60 (children from 3 months)',
    paymentOptions: 'Monthly, Quarterly, or Annual',
    status: 'Active',
  },
  {
    productId: 'P04',
    productName: 'Prosperity Retirement & Savings',
    category: 'Savings',
    shortTagline: 'Build a disciplined retirement corpus and medium-term wealth with guaranteed protection',
    keyBenefits: ['Structured Wealth Growth', 'Flexible Maturity Payouts', 'Built-In Life Security'],
    detailedBenefits: [
      {
        title: 'Structured Wealth Growth',
        description: 'Consistent compounding designed to help professionals and business owners build a reliable future reserve.',
      },
      {
        title: 'Flexible Maturity & Pension Options',
        description: 'Choose a single lump-sum payout or convert your maturity fund into steady monthly retirement income.',
      },
      {
        title: 'Built-In Life Security',
        description: 'Combines disciplined savings with life protection so your financial target remains safeguarded.',
      },
      {
        title: 'Top-Up Flexibility',
        description: 'Strengthen your fund with voluntary top-ups whenever you receive annual bonuses or business surplus.',
      },
    ],
    eligibility: 'Professionals, salaried earners, and entrepreneurs aged 20–55',
    paymentOptions: 'Monthly, Quarterly, Semi-Annual, or Annual',
    status: 'Active',
  },
];

export const STARTER_EVENTS_OFFERS: EventOffer[] = [
  {
    id: 'EO01',
    title: 'Complimentary Family Financial Health Review',
    type: 'Free Program',
    date: 'Available Weekly · By Appointment',
    location: 'In-Person (Colombo / Southern Province) or WhatsApp Video',
    summary: 'A 30-minute one-on-one coverage audit with Nilupul Lokuhewage to identify protection gaps, review existing policies, and map out your 5-year education or retirement targets.',
    highlight: '100% Free · Personalized Protection Blueprint Included',
    ctaLabel: 'Book Free Review',
    status: 'Open',
  },
  {
    id: 'EO02',
    title: 'Child Higher-Education Planning Clinic',
    type: 'Event',
    date: '12 Dec 2026 · 6:30 PM',
    location: 'Online Live Session (Google Meet)',
    summary: 'Interactive evening session for young parents covering Sri Lankan & overseas university inflation projections and how guaranteed child protection plans safeguard tuition.',
    highlight: 'Free Registration · Live Q&A with HNB Life Advisory Team',
    ctaLabel: 'Reserve My Seat',
    status: 'Upcoming',
  },
  {
    id: 'EO03',
    title: 'Zero-Fee Health Rider Upgrade Campaign',
    type: 'Special Offer',
    date: 'Valid through 31 Dec 2026',
    location: 'Existing & New HNB Life Clients',
    summary: 'Enhance your existing life policy with hospitalisation or critical illness riders with complimentary advisory assessment and priority underwriting assistance.',
    highlight: 'Priority Processing · Complimentary Rider Comparison',
    ctaLabel: 'Claim Special Offer',
    status: 'Limited',
  },
];

export const STARTER_CLIENTS: ClientRecord[] = [];

export const STARTER_REFERRALS: ReferralRecord[] = [];

export const STARTER_REWARDS: RewardVoucher[] = [];

export async function loadInitialDataset(): Promise<TrueCareDataset> {
  const products = [...STARTER_PRODUCTS];

  try {
    const res = await fetch('/assets/aistudio/Nilupul_Lokuhewage_-_Client_App_DB_0bc89c40');
    if (res.ok) {
      const csvText = await res.text();
      const rows = parseCsvRows(csvText);
      if (rows.length >= 2) {
        const headers = rows[0].map((h) => h.trim().toLowerCase());
        const idxId = headers.findIndex((h) => h.includes('product_id') || h === 'id');
        const idxName = headers.findIndex((h) => h.includes('product_name') || h === 'name');
        const idxCat = headers.findIndex((h) => h.includes('category'));
        const idxTag = headers.findIndex((h) => h.includes('tagline') || h.includes('short'));
        const idxBen = headers.findIndex((h) => h.includes('benefit'));
        const idxImg = headers.findIndex((h) => h.includes('image'));
        const idxStatus = headers.findIndex((h) => h.includes('status'));

        const parsedFromAttachment: Product[] = [];

        for (let r = 1; r < rows.length; r++) {
          const row = rows[r];
          const productName = (idxName >= 0 ? row[idxName] : row[1])?.trim();
          if (!productName) continue;

          const productId = (idxId >= 0 ? row[idxId] : row[0])?.trim() || `P0${r}`;
          const category = normalizeCategory(idxCat >= 0 ? row[idxCat] : row[2]);
          const shortTagline = (idxTag >= 0 ? row[idxTag] : row[3])?.trim() || 'Tailored HNB Life protection plan';
          const rawBenefits = (idxBen >= 0 ? row[idxBen] : row[4]) || '';
          const keyBenefits = rawBenefits
            .split(/[,;|]/)
            .map((b) => b.trim())
            .filter(Boolean);
          const imageUrl = (idxImg >= 0 ? row[idxImg] : row[5])?.trim() || undefined;
          const rawStatus = (idxStatus >= 0 ? row[idxStatus] : row[6])?.trim().toLowerCase() || 'active';

          if (rawStatus === 'inactive' || rawStatus === 'archived') continue;

          const existingMatch = STARTER_PRODUCTS.find(
            (p) => p.productId.toLowerCase() === productId.toLowerCase()
          );

          parsedFromAttachment.push({
            productId,
            productName,
            category,
            shortTagline,
            keyBenefits: keyBenefits.length > 0 ? keyBenefits : existingMatch?.keyBenefits || ['Guaranteed Protection'],
            detailedBenefits:
              keyBenefits.length > 0
                ? expandBenefitDetails(keyBenefits, category)
                : existingMatch?.detailedBenefits || [],
            eligibility: existingMatch?.eligibility || 'Sri Lankan residents aged 18–60 years',
            paymentOptions: existingMatch?.paymentOptions || 'Monthly, Quarterly, Semi-Annual, or Annual',
            imageUrl,
            status: rawStatus === 'featured' ? 'Featured' : 'Active',
          });
        }

        if (parsedFromAttachment.length > 0) {
          // Merge attached CSV rows first, followed by complementary starter products not already in the CSV
          const attachedIds = new Set(parsedFromAttachment.map((p) => p.productId.toLowerCase()));
          const mergedProducts = [
            ...parsedFromAttachment,
            ...products.filter((p) => !attachedIds.has(p.productId.toLowerCase())),
          ];
          return {
            products: mergedProducts,
            eventsOffers: STARTER_EVENTS_OFFERS,
            clients: STARTER_CLIENTS,
            referrals: STARTER_REFERRALS,
            rewards: STARTER_REWARDS,
          };
        }
      }
    }
  } catch (err) {
    console.warn('Could not load attached CSV file, falling back to starter dataset:', err);
  }

  return {
    products,
    eventsOffers: STARTER_EVENTS_OFFERS,
    clients: STARTER_CLIENTS,
    referrals: STARTER_REFERRALS,
    rewards: STARTER_REWARDS,
  };
}
