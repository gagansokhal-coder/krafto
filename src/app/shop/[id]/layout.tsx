import { Metadata } from 'next';
import prisma from '@/lib/prisma';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: params.id },
    });
    
    // If not found by slug, try by ID
    const dbProduct = product || await prisma.product.findUnique({
      where: { id: params.id },
    });

    if (!dbProduct) return { title: 'Product Not Found | Kraafto' };

    return {
      title: `${dbProduct.name} — Kraafto`,
      description: dbProduct.description ? dbProduct.description.substring(0, 160) + '...' : 'Discover premium handcrafted luxury gifts at Kraafto.',
    };
  } catch (e) {
    return { title: 'Product | Kraafto' };
  }
}

export default async function ProductLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  let product = null;
  let images: { url: string }[] = [];
  try {
    product = await prisma.product.findUnique({
      where: { slug: params.id },
      include: { images: true },
    });
    
    if (!product) {
      product = await prisma.product.findUnique({
        where: { id: params.id },
        include: { images: true },
      });
    }

    if (product && product.images) {
      images = product.images as { url: string }[];
    }
  } catch (e) {
    // ignore
  }

  return (
    <>
      {product && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              "name": product.name,
              "image": images.map((img) => img.url),
              "description": product.description,
              "sku": product.id,
              "brand": { "@type": "Brand", "name": "Kraafto" },
              "offers": {
                "@type": "Offer",
                "price": product.price.toString(),
                "priceCurrency": "INR",
                "availability": "https://schema.org/InStock",
                "seller": { "@type": "Organization", "name": "Kraafto" }
              }
            }),
          }}
        />
      )}
      {children}
    </>
  );
}
