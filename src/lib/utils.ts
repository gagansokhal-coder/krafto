/**
 * Merge class names (lightweight version without clsx/tailwind-merge deps).
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Format a number as Indian Rupees.
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Generate a slug from a string.
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Calculate estimated delivery date range.
 */
export function getEstimatedDelivery(
  processingDays = 2,
  isExpress = false,
  hasGiftWrap = false
): { from: Date; to: Date } {
  const today = new Date();
  const extraDays = hasGiftWrap ? 1 : 0;
  const shippingMin = isExpress ? 2 : 5;
  const shippingMax = isExpress ? 3 : 7;

  const from = new Date(today);
  from.setDate(today.getDate() + processingDays + extraDays + shippingMin);

  const to = new Date(today);
  to.setDate(today.getDate() + processingDays + extraDays + shippingMax);

  return { from, to };
}

/**
 * Format a date range as a human-readable string.
 */
export function formatDateRange(from: Date, to: Date): string {
  const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  return `${from.toLocaleDateString('en-IN', opts)} – ${to.toLocaleDateString('en-IN', opts)}`;
}
