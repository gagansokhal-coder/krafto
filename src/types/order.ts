export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED';

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

export type ShippingMethod = 'STANDARD' | 'EXPRESS';

export type WrapStyle = 'CLASSIC_GOLD' | 'BOTANICAL' | 'LUXURY_BOX' | 'ECO_WRAP';

export interface GiftOption {
  wrapStyle: WrapStyle;
  wrapPrice: number;
  message?: string;
  recipientName?: string;
  hidePricing: boolean;
}

export interface OrderItem {
  id: string;
  productId: string;
  variantId?: string | null;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  isGift: boolean;
  giftOption?: GiftOption | null;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  email: string;
  phone: string;
  shippingMethod: ShippingMethod;
  shippingCost: number;
  subtotal: number;
  giftWrapTotal: number;
  discountTotal: number;
  grandTotal: number;
  trackingNumber?: string | null;
  trackingUrl?: string | null;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}
