import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shop All Categories — Kraafto',
  description: 'Shop premium handcrafted gifts and luxury decor. Find the perfect present for every occasion.',
};

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
