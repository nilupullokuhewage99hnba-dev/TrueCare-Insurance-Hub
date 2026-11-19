import {
  AdvisorProfileData,
  ClientRewardsResponse,
  EventOffer,
  OfferType,
  Product,
  ReferralSubmissionPayload,
  RewardVoucher,
} from '../types';
import {
  ADVISOR,
  DEFAULT_ADVISOR_PHOTO,
  expandBenefitDetails,
  normalizeCategory,
  normalizePhone,
} from '../data/advisorData';

export const APPS_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbyyvMWjsXfQT9gVQxpCvEf_z5VbTorjYsu_f702fdyNpVtWCueeaONMlR1_TuQ7orw/exec';

type AnyRecord = Record<string, unknown>;

function pickField(obj: AnyRecord, keys: string[]): string {
  const entries = Object.entries(obj);
  for (const candidate of keys) {
    const clean = candidate.toLowerCase().replace(/[^a-z0-9]/g, '');
    const exact = entries.find(
      ([k]) => k.trim().toLowerCase().replace(/[^a-z0-9]/g, '') === clean
    );
    if (exact && exact[1] !== undefined && exact[1] !== null && String(exact[1]).trim() !== '') {
      return String(exact[1]).trim();
    }
  }
  return '';
}

function pickNumber(obj: AnyRecord, keys: string[]): number {
  const val = pickField(obj, keys);
  if (!val) return 0;
  const parsed = Number(val.replace(/[^0-9.-]/g, ''));
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatLocalPhoneDisplay(raw: string, fallbackDisplay: string): string {
  const norm = normalizePhone(raw);
  if (norm.length === 10 && norm.startsWith('0')) {
    return `${norm.slice(0, 3)} ${norm.slice(3, 6)} ${norm.slice(6)}`;
  }
  return fallbackDisplay;
}

function parsePublicProducts(rawList: unknown): Product[] {
  if (!Array.isArray(rawList)) return [];

  const products: Product[] = [];
  rawList.forEach((item, idx) => {
    if (!item || typeof item !== 'object') return;
    const obj = item as AnyRecord;

    const productName = pickField(obj, ['Product_Name', 'ProductName', 'Name', 'Title']);
    if (!productName) return;

    const statusRaw = pickField(obj, ['Status']).toLowerCase();
    if (statusRaw === 'inactive' || statusRaw === 'archived' || statusRaw === 'hidden') return;

    const productId = pickField(obj, ['Product_ID', 'ProductId', 'ID']) || `P${String(idx + 1).padStart(2, '0')}`;
    const category = normalizeCategory(pickField(obj, ['Category', 'Type']));
    const shortTagline =
      pickField(obj, ['Short_Tagline', 'ShortTagline', 'Tagline', 'Summary', 'Description']) ||
      'Tailored HNB Life protection plan';
    const rawBenefits = pickField(obj, ['Key_Benefits', 'KeyBenefits', 'Benefits']);
    const keyBenefits = rawBenefits
      .split(/[,;|\n]/)
      .map((b) => b.trim())
      .filter(Boolean);
    const imageUrl = pickField(obj, ['Image_URL', 'ImageUrl', 'Image']) || undefined;
    const eligibility =
      pickField(obj, ['Eligibility']) || 'Sri Lankan residents aged 18–60 years';
    const paymentOptions =
      pickField(obj, ['Payment_Options', 'PaymentOptions', 'Payment']) ||
      'Monthly, Quarterly, Semi-Annual, or Annual';

    products.push({
      productId,
      productName,
      category,
      shortTagline,
      keyBenefits: keyBenefits.length > 0 ? keyBenefits : ['Comprehensive Protection'],
      detailedBenefits: expandBenefitDetails(
        keyBenefits.length > 0 ? keyBenefits : ['Comprehensive Protection'],
        category
      ),
      eligibility,
      paymentOptions,
      imageUrl,
      status: statusRaw === 'featured' ? 'Featured' : 'Active',
    });
  });

  return products;
}

function parsePublicEvents(rawList: unknown): EventOffer[] {
  if (!Array.isArray(rawList)) return [];

  const events: EventOffer[] = [];
  rawList.forEach((item, idx) => {
    if (!item || typeof item !== 'object') return;
    const obj = item as AnyRecord;

    const title = pickField(obj, ['Title', 'Event_Name', 'Offer_Name', 'Name']);
    if (!title) return;

    const statusRaw = pickField(obj, ['Status']).toLowerCase();
    if (statusRaw === 'closed' || statusRaw === 'inactive' || statusRaw === 'expired') return;

    const rawType = pickField(obj, ['Type', 'Category']).toLowerCase();
    let type: OfferType = 'Event';
    if (rawType.includes('offer') || rawType.includes('promo') || rawType.includes('discount')) {
      type = 'Special Offer';
    } else if (rawType.includes('free') || rawType.includes('program') || rawType.includes('checkup')) {
      type = 'Free Program';
    }

    events.push({
      id: pickField(obj, ['Event_ID', 'Offer_ID', 'ID']) || `EO${String(idx + 1).padStart(2, '0')}`,
      title,
      type,
      date: pickField(obj, ['Date', 'Event_Date', 'Valid_Until', 'Schedule']) || 'Upcoming',
      location: pickField(obj, ['Location', 'Venue', 'Audience']) || 'Sri Lanka / Online',
      summary:
        pickField(obj, ['Summary', 'Description', 'Details']) ||
        'Exclusive HNB Life client event and advisory program.',
      highlight:
        pickField(obj, ['Highlight', 'Offer_Highlight', 'Benefit', 'Badge']) ||
        'Open for TrueCare clients',
      ctaLabel: pickField(obj, ['CTA_Label', 'Action']) || 'Register Interest',
      status: statusRaw === 'limited' ? 'Limited' : statusRaw === 'upcoming' ? 'Upcoming' : 'Open',
    });
  });

  return events;
}

function parseAdvisorProfile(raw: unknown): AdvisorProfileData {
  const base: AdvisorProfileData = {
    fullName: ADVISOR.fullName,
    displayName: ADVISOR.displayName,
    role: ADVISOR.role,
    company: ADVISOR.company,
    bio: ADVISOR.bio,
    phoneRaw: ADVISOR.phoneRaw,
    phoneDisplay: ADVISOR.phoneDisplay,
    phoneTel: ADVISOR.phoneTel,
    whatsappRaw: ADVISOR.whatsappRaw,
    whatsappDisplay: ADVISOR.whatsappDisplay,
    whatsappNumber: ADVISOR.whatsappNumber,
    email: ADVISOR.email,
    photoUrl: DEFAULT_ADVISOR_PHOTO,
  };

  if (!raw || typeof raw !== 'object') return base;
  const obj = raw as AnyRecord;

  const fullName = pickField(obj, ['Full_Name', 'Name', 'Advisor_Name']) || base.fullName;
  const role = pickField(obj, ['Role', 'Title', 'Position']) || base.role;
  const company = pickField(obj, ['Company', 'Organization']) || base.company;
  const bio = pickField(obj, ['Bio', 'About', 'Summary']) || base.bio;
  const email = pickField(obj, ['Email', 'Advisor_Email']) || base.email;
  const photoUrl =
    pickField(obj, ['Photo_URL', 'PhotoURL', 'Avatar_URL', 'Profile_Photo', 'Photo']) ||
    DEFAULT_ADVISOR_PHOTO;

  // Always enforce requested call number (0719414247) and WhatsApp number (0701279963 / 94701279963)
  const sheetPhone = pickField(obj, ['Call_Phone', 'Phone', 'Mobile']);
  const normalizedCall = sheetPhone ? normalizePhone(sheetPhone) : ADVISOR.phoneRaw;
  const finalCallRaw = normalizedCall === ADVISOR.phoneRaw ? ADVISOR.phoneRaw : ADVISOR.phoneRaw;

  return {
    fullName,
    displayName: ADVISOR.displayName,
    role,
    company,
    bio,
    phoneRaw: finalCallRaw,
    phoneDisplay: formatLocalPhoneDisplay(finalCallRaw, ADVISOR.phoneDisplay),
    phoneTel: `tel:+94${finalCallRaw.replace(/^0/, '')}`,
    whatsappRaw: ADVISOR.whatsappRaw,
    whatsappDisplay: ADVISOR.whatsappDisplay,
    whatsappNumber: ADVISOR.whatsappNumber,
    email,
    photoUrl,
  };
}

export interface PublicDataResult {
  products: Product[];
  eventsOffers: EventOffer[];
  advisor: AdvisorProfileData;
  fetchedAt: string;
}

export async function fetchPublicData(): Promise<PublicDataResult> {
  const url = `${APPS_SCRIPT_URL}?action=getPublicData`;
  const res = await fetch(url, {
    method: 'GET',
    redirect: 'follow',
  });

  if (!res.ok) {
    throw new Error(`Unable to load TrueCare data (HTTP ${res.status}).`);
  }

  const data = (await res.json()) as AnyRecord;
  if (data.status === 'error') {
    throw new Error(String(data.message || 'Unable to load public data.'));
  }

  const products = parsePublicProducts(data.products ?? data.Products);
  const eventsOffers = parsePublicEvents(
    data.events ?? data.eventsOffers ?? data.Events_Offers ?? data.offers
  );
  const advisor = parseAdvisorProfile(data.advisor ?? data.advisorProfile ?? data.Advisor_Profile);

  return {
    products,
    eventsOffers,
    advisor,
    fetchedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };
}

function parseRewardItems(rawRewards: unknown, clientPhone: string): RewardVoucher[] {
  if (!Array.isArray(rawRewards)) return [];
  const vouchers: RewardVoucher[] = [];

  rawRewards.forEach((item, idx) => {
    if (!item || typeof item !== 'object') return;
    const obj = item as AnyRecord;

    const title =
      pickField(obj, ['Title', 'Reward_Name', 'Voucher_Name', 'Reward', 'Reward_Type', 'Description']) ||
      'Client Referral Reward';
    const rawStatus = pickField(obj, ['Status']).toLowerCase();
    let status: RewardVoucher['status'] = 'Available';
    if (rawStatus.includes('redeem') || rawStatus.includes('used') || rawStatus.includes('claimed')) {
      status = 'Redeemed';
    } else if (rawStatus.includes('unlock') || rawStatus.includes('approve')) {
      status = 'Unlocked';
    } else if (rawStatus.includes('pend')) {
      status = 'Pending';
    }

    vouchers.push({
      voucherId:
        pickField(obj, ['Voucher_ID', 'Reward_ID', 'ID']) || `RW-${idx + 1}`,
      clientPhone:
        pickField(obj, ['Client_Phone', 'Phone', 'Mobile']) || clientPhone,
      title,
      valueLkr: pickNumber(obj, ['Value_LKR', 'Credits_LKR', 'Value', 'Amount', 'Credit_Amount']),
      pointsRequired: pickNumber(obj, ['Points', 'Points_Earned', 'Points_Required']),
      code: pickField(obj, ['Code', 'Voucher_Code', 'Reward_Code']) || `TC-${idx + 1}`,
      expiryDate: pickField(obj, ['Expiry_Date', 'Expiry', 'Valid_Until', 'Date']) || 'Active',
      status,
      description:
        pickField(obj, ['Description', 'Notes', 'Details', 'Reason']) ||
        'Verified TrueCare referral reward.',
    });
  });

  return vouchers;
}

export async function fetchClientRewards(
  phone: string,
  pin: string
): Promise<ClientRewardsResponse> {
  const cleanPhone = normalizePhone(phone.trim());
  const cleanPin = pin.trim();

  const params = new URLSearchParams({
    action: 'getClientRewards',
    phone: cleanPhone,
    pin: cleanPin,
  });

  const res = await fetch(`${APPS_SCRIPT_URL}?${params.toString()}`, {
    method: 'GET',
    redirect: 'follow',
  });

  if (!res.ok) {
    throw new Error('Unable to verify credentials right now. Please try again.');
  }

  const data = (await res.json()) as AnyRecord;
  if (data.status === 'error' || data.ok === false || data.success === false) {
    throw new Error(String(data.message || 'Invalid Phone Number or PIN'));
  }

  const clientObj = (
    (data.client && typeof data.client === 'object' ? data.client : null) ||
    (data.profile && typeof data.profile === 'object' ? data.profile : null) ||
    data
  ) as AnyRecord;

  const clientName =
    pickField(clientObj, ['Client_Name', 'Name', 'Full_Name']) || 'Valued Client';
  const clientId = pickField(clientObj, ['Client_ID', 'ClientId', 'ID']);
  const clientPhoneRaw =
    pickField(clientObj, ['Phone', 'Client_Phone', 'Mobile']) || cleanPhone;
  const tier = pickField(clientObj, ['Tier', 'Level', 'Membership', 'Status']) || 'TrueCare Client';

  const points =
    pickNumber(clientObj, ['Points', 'Total_Points', 'Reward_Points', 'Loyalty_Points']) ||
    pickNumber(data, ['points', 'totalPoints', 'Points']);
  const creditsLkr =
    pickNumber(clientObj, ['Credits_LKR', 'Credits', 'Credit_Balance', 'Total_Credits']) ||
    pickNumber(data, ['credits', 'creditsLkr', 'Credits_LKR']);
  const successfulReferrals =
    pickNumber(clientObj, ['Successful_Referrals', 'Referrals_Count', 'Referrals']) ||
    pickNumber(data, ['successfulReferrals', 'referralsCount']);

  const rawRewardsList = data.rewards ?? data.vouchers ?? data.Rewards ?? data.Vouchers ?? [];
  const rewards = parseRewardItems(rawRewardsList, normalizePhone(clientPhoneRaw));

  return {
    client: {
      clientId,
      name: clientName,
      phone: normalizePhone(clientPhoneRaw),
      email: pickField(clientObj, ['Email']),
      tier,
      points,
      creditsLkr,
      successfulReferrals,
    },
    rewards,
  };
}

export async function submitReferralToGateway(
  payload: ReferralSubmissionPayload
): Promise<{ message: string; referralId?: string }> {
  // Using text/plain avoids CORS preflight issues with Google Apps Script Web Apps
  // while delivering valid JSON to e.postData.contents in doPost(e).
  const res = await fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    redirect: 'follow',
    headers: {
      'Content-Type': 'text/plain;charset=utf-8',
    },
    body: JSON.stringify({
      action: 'submitReferral',
      referrerName: payload.referrerName,
      referrerPhone: payload.referrerPhone,
      friendName: payload.friendName,
      friendPhone: payload.friendPhone,
      interestedIn: payload.interestedIn,
      notes: payload.notes,
    }),
  });

  if (!res.ok) {
    throw new Error(`Submission failed (HTTP ${res.status}). Please try again.`);
  }

  const text = await res.text();
  try {
    const parsed = JSON.parse(text) as AnyRecord;
    if (parsed.status === 'error' || parsed.ok === false || parsed.success === false) {
      throw new Error(String(parsed.message || 'Unable to submit referral.'));
    }
    return {
      message: String(parsed.message || 'Referral submitted successfully.'),
      referralId: pickField(parsed, ['referralId', 'Referral_ID', 'id']) || undefined,
    };
  } catch (err) {
    if (err instanceof Error && err.message !== '' && !err.message.includes('JSON')) {
      throw err;
    }
    return {
      message: 'Referral submitted successfully.',
    };
  }
}
