// ─── Brand ───────────────────────────────────────────────────────────────────
export const BRAND_NAME = 'Kraafto';
export const BRAND_TAGLINE = 'The Art of Gifting, Reimagined';
export const BRAND_EMAIL = 'concierge@kraafto.com';
export const BRAND_PHONE = '+91-1234567890';
export const BRAND_WHATSAPP = 'https://wa.me/911234567890';

// ─── URLs ─────────────────────────────────────────────────────────────────────
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://kraafto.com';

// ─── Shipping ─────────────────────────────────────────────────────────────────
export const FREE_SHIPPING_THRESHOLD = 2000; // INR
export const STANDARD_SHIPPING_COST = 99;    // INR
export const EXPRESS_SHIPPING_COST = 199;    // INR
export const STANDARD_SHIPPING_DAYS = { min: 5, max: 7 };
export const EXPRESS_SHIPPING_DAYS = { min: 2, max: 3 };
export const BASE_PROCESSING_DAYS = 2;
export const GIFT_WRAP_EXTRA_DAYS = 1;

// ─── Gift Wrapping ────────────────────────────────────────────────────────────
export const GIFT_WRAP_OPTIONS = [
  { id: 'CLASSIC_GOLD', label: 'Classic Gold', description: 'Gold foil paper with satin ribbon', price: 99 },
  { id: 'BOTANICAL', label: 'Botanical', description: 'Kraft paper with dried flower accent', price: 149 },
  { id: 'LUXURY_BOX', label: 'Luxury Box', description: 'Magnetic closure box with tissue paper', price: 249 },
  { id: 'ECO_WRAP', label: 'Eco Wrap', description: 'Recycled handmade paper', price: 0 },
] as const;

// ─── Occasions ────────────────────────────────────────────────────────────────
export const OCCASIONS = [
  { label: 'Birthday', icon: '🎂', slug: 'birthday' },
  { label: 'Anniversary', icon: '💍', slug: 'anniversary' },
  { label: 'Wedding', icon: '💒', slug: 'wedding' },
  { label: 'Corporate', icon: '🏢', slug: 'corporate' },
  { label: 'Thank You', icon: '🙏', slug: 'thank-you' },
  { label: 'Housewarming', icon: '🏠', slug: 'housewarming' },
  { label: 'Festive', icon: '🎄', slug: 'festive' },
  { label: 'New Baby', icon: '👶', slug: 'new-baby' },
] as const;

// ─── Product Badges ───────────────────────────────────────────────────────────
export const BADGE_PRIORITY = [
  'Limited Edition',
  'Sale',
  'Best Seller',
  'Handcrafted',
  'New Arrival',
  'Eco-Friendly',
] as const;

// ─── Pagination ───────────────────────────────────────────────────────────────
export const DEFAULT_PAGE_SIZE = 12;
export const MAX_PAGE_SIZE = 100;

// ─── Stock thresholds ─────────────────────────────────────────────────────────
export const LOW_STOCK_THRESHOLD = 5;

// ─── Gift message ─────────────────────────────────────────────────────────────
export const GIFT_MESSAGE_MAX_CHARS = 200;

export const GIFT_MESSAGE_TEMPLATES = [
  'Happy Birthday! Wishing you a wonderful day 🎂',
  'Congratulations on your special day! ✨',
  'With love and warm wishes 💕',
  'Thank you for everything 🙏',
] as const;

// ─── Social ───────────────────────────────────────────────────────────────────
export const SOCIAL_LINKS = {
  instagram: 'https://www.instagram.com/kraafto',
  pinterest: 'https://www.pinterest.com/kraafto',
  facebook: 'https://www.facebook.com/kraafto',
} as const;
