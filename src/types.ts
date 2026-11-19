export type ProductCategory = 'Life Insurance' | 'Education' | 'Health' | 'Savings';

export interface BenefitDetail {
  title: string;
  description: string;
}

export interface Product {
  productId: string;
  productName: string;
  category: ProductCategory;
  shortTagline: string;
  keyBenefits: string[];
  detailedBenefits: BenefitDetail[];
  eligibility: string;
  paymentOptions: string;
  imageUrl?: string;
  status: 'Active' | 'Featured' | 'Inactive';
}

export type OfferType = 'Event' | 'Special Offer' | 'Free Program';

export interface EventOffer {
  id: string;
  title: string;
  type: OfferType;
  date: string;
  location: string;
  summary: string;
  highlight: string;
  ctaLabel: string;
  status: 'Open' | 'Upcoming' | 'Limited';
}

export interface ClientRecord {
  clientId: string;
  name: string;
  phone: string;
  email: string;
  tier: string;
  points: number;
  creditsLkr: number;
  successfulReferrals: number;
}

export interface ReferralSubmissionPayload {
  referrerName: string;
  referrerPhone: string;
  friendName: string;
  friendPhone: string;
  interestedIn: string;
  notes: string;
}

export interface ReferralRecord {
  referralId: string;
  submittedAt: string;
  referrerName: string;
  referrerPhone: string;
  friendName: string;
  friendPhone: string;
  interestedProduct: string;
  notes: string;
  status: 'Pending' | 'Contacted' | 'Policy Issued';
}

export interface RewardVoucher {
  voucherId: string;
  clientPhone: string;
  title: string;
  valueLkr: number;
  pointsRequired: number;
  code: string;
  expiryDate: string;
  status: 'Available' | 'Redeemed' | 'Unlocked' | 'Pending';
  description: string;
}

export interface ClientRewardsResponse {
  client: ClientRecord;
  rewards: RewardVoucher[];
}

export interface AdvisorProfileData {
  fullName: string;
  displayName: string;
  role: string;
  company: string;
  bio: string;
  phoneRaw: string;
  phoneDisplay: string;
  phoneTel: string;
  whatsappRaw: string;
  whatsappDisplay: string;
  whatsappNumber: string;
  email: string;
  photoUrl: string;
}

export interface TrueCareDataset {
  products: Product[];
  eventsOffers: EventOffer[];
  clients: ClientRecord[];
  referrals: ReferralRecord[];
  rewards: RewardVoucher[];
}

export type ActiveTab = 'home' | 'products' | 'events' | 'refer' | 'rewards';
