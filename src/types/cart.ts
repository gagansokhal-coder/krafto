import type { WrapStyle } from './order';

export interface CartGiftOption {
  enabled: boolean;
  wrapStyle?: WrapStyle;
  message?: string;
  recipientName?: string;
  hidePricing?: boolean;
}

export interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  imageUrl: string;
  variantId?: string;
  giftOption?: CartGiftOption;
}
