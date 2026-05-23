export type ProductBadge =
  | 'Limited Edition'
  | 'Best Seller'
  | 'Handcrafted'
  | 'Eco-Friendly'
  | 'New Arrival'
  | 'Sale'
  | 'Premium';

export interface ProductImage {
  id: string;
  url: string;
  alt?: string | null;
  position: number;
  isMain: boolean;
  width?: number | null;
  height?: number | null;
}

export interface ProductVariant {
  id: string;
  name: string;
  sku?: string | null;
  price?: number | null;
  inventory: number;
  attributes: Record<string, string>;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
}

export interface ProductOccasion {
  id: string;
  name: string;
  slug: string;
  icon?: string | null;
}

export interface ProductReview {
  id: string;
  rating: number;
  title?: string | null;
  body: string;
  images: string[];
  isVerified: boolean;
  helpfulCount: number;
  createdAt: string;
  user: { name?: string | null; image?: string | null };
}

export interface ProductListItem {
  id: string;
  name: string;
  slug: string;
  price: string | number;
  compareAtPrice?: string | number | null;
  imageUrl?: string | null;
  imageAlt?: string | null;
  category?: string | null;
  inStock: boolean;
  badges: ProductBadge[];
}

export interface ProductDetail {
  id: string;
  name: string;
  slug: string;
  description: string;
  story?: string | null;
  price: string | number;
  compareAtPrice?: string | number | null;
  sku?: string | null;
  status: string;
  isFeatured: boolean;
  isHandcrafted: boolean;
  isLimitedEdition: boolean;
  isBestSeller: boolean;
  isEcoFriendly: boolean;
  editionNumber?: number | null;
  editionTotal?: number | null;
  materials: string[];
  inventory: number;
  lowStockThreshold: number;
  processingDays: number;
  madeToOrder: boolean;
  metaTitle?: string | null;
  metaDescription?: string | null;
  images: ProductImage[];
  variants: ProductVariant[];
  categories: ProductCategory[];
  occasions: ProductOccasion[];
  reviews: ProductReview[];
  averageRating: number;
  reviewCount: number;
  badges: ProductBadge[];
}
