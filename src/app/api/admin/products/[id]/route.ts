export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/admin/products/[id] — get single product for editing
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        images: { orderBy: { position: 'asc' } },
        categories: { select: { id: true, name: true, slug: true } },
        tags: { select: { id: true, name: true, slug: true } },
        occasions: { select: { id: true, name: true, slug: true } },
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error('GET /api/admin/products/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/products/[id] — update product
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      slug,
      description,
      story,
      price,
      compareAtPrice,
      costPrice,
      sku,
      status,
      isFeatured,
      isHandcrafted,
      isLimitedEdition,
      isBestSeller,
      isEcoFriendly,
      editionNumber,
      editionTotal,
      materials,
      inventory,
      stock,
      lowStockThreshold,
      processingDays,
      madeToOrder,
      metaTitle,
      metaDescription,
      categoryIds,
      tagIds,
      occasionIds,
      images,
    } = body;

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: params.id },
    });

    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // If slug is being changed, check for uniqueness
    if (slug && slug !== existingProduct.slug) {
      const slugExists = await prisma.product.findUnique({
        where: { slug },
      });
      if (slugExists) {
        return NextResponse.json(
          { error: 'A product with this slug already exists' },
          { status: 409 }
        );
      }
    }

    // Build update data
    const updateData: any = {};
    
    if (name !== undefined) updateData.name = name;
    if (slug !== undefined) updateData.slug = slug;
    if (description !== undefined) updateData.description = description;
    if (story !== undefined) updateData.story = story;
    if (price !== undefined) updateData.price = price;
    if (compareAtPrice !== undefined) updateData.compareAtPrice = compareAtPrice;
    if (costPrice !== undefined) updateData.costPrice = costPrice;
    if (sku !== undefined) updateData.sku = sku;
    if (status !== undefined) updateData.status = status;
    if (isFeatured !== undefined) updateData.isFeatured = isFeatured;
    if (isHandcrafted !== undefined) updateData.isHandcrafted = isHandcrafted;
    if (isLimitedEdition !== undefined) updateData.isLimitedEdition = isLimitedEdition;
    if (isBestSeller !== undefined) updateData.isBestSeller = isBestSeller;
    if (isEcoFriendly !== undefined) updateData.isEcoFriendly = isEcoFriendly;
    if (editionNumber !== undefined) updateData.editionNumber = editionNumber;
    if (editionTotal !== undefined) updateData.editionTotal = editionTotal;
    if (materials !== undefined) updateData.materials = materials;
    if (inventory !== undefined) {
      updateData.inventory = inventory;
      updateData.stock = inventory; // Keep stock in sync
    }
    if (stock !== undefined) {
      updateData.stock = stock;
      updateData.inventory = stock; // Keep inventory in sync
    }
    if (lowStockThreshold !== undefined) updateData.lowStockThreshold = lowStockThreshold;
    if (processingDays !== undefined) updateData.processingDays = processingDays;
    if (madeToOrder !== undefined) updateData.madeToOrder = madeToOrder;
    if (metaTitle !== undefined) updateData.metaTitle = metaTitle;
    if (metaDescription !== undefined) updateData.metaDescription = metaDescription;

    // Handle relationships
    if (categoryIds !== undefined) {
      updateData.categories = {
        set: categoryIds.map((id: string) => ({ id })),
      };
    }
    if (tagIds !== undefined) {
      updateData.tags = {
        set: tagIds.map((id: string) => ({ id })),
      };
    }
    if (occasionIds !== undefined) {
      updateData.occasions = {
        set: occasionIds.map((id: string) => ({ id })),
      };
    }

    // Use transaction to update product and sync images
    const product = await prisma.$transaction(async (tx) => {
      // Update product fields
      await tx.product.update({
        where: { id: params.id },
        data: updateData,
      });

      // Sync product images if provided
      if (images !== undefined && Array.isArray(images)) {
        // Delete existing images
        await tx.productImage.deleteMany({
          where: { productId: params.id },
        });

        // Create new images
        if (images.length > 0) {
          await tx.productImage.createMany({
            data: images.map((img: { url: string; alt?: string; isMain?: boolean; position?: number }, idx: number) => ({
              productId: params.id,
              url: img.url,
              alt: img.alt || null,
              isMain: img.isMain ?? (idx === 0),
              position: img.position ?? idx,
            })),
          });
        }
      }

      // Return updated product with all relations
      return tx.product.findUnique({
        where: { id: params.id },
        include: {
          images: { orderBy: { position: 'asc' } },
          categories: true,
          tags: true,
          occasions: true,
        },
      });
    });

    return NextResponse.json({ product });
  } catch (error) {
    console.error('PATCH /api/admin/products/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/products/[id] — soft delete product
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        deletedAt: new Date(),
        status: 'ARCHIVED',
      },
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Product deleted successfully',
      product 
    });
  } catch (error) {
    console.error('DELETE /api/admin/products/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
