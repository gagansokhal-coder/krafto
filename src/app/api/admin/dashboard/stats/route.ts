export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Aggregate dashboard stats
    const [
      totalProducts,
      activeProducts,
      totalOrders,
      totalCustomers,
      lowStockProducts,
      recentOrders,
      revenueAgg,
    ] = await Promise.all([
      prisma.product.count({ where: { deletedAt: null } }),
      prisma.product.count({ where: { status: 'ACTIVE', deletedAt: null } }),
      prisma.order.count(),
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      // Low-stock count: products where inventory is at or below their threshold
      // We query all active products and filter in-memory since Prisma doesn't support
      // cross-column comparisons natively without raw SQL
      prisma.product.findMany({
        where: {
          status: 'ACTIVE',
          deletedAt: null,
        },
        select: { inventory: true, lowStockThreshold: true },
      }).then(products => products.filter(p => p.inventory <= p.lowStockThreshold).length),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          orderNumber: true,
          grandTotal: true,
          status: true,
          createdAt: true,
          user: { select: { name: true, email: true } },
        },
      }),
      prisma.order.aggregate({
        where: { paymentStatus: 'PAID' },
        _sum: { grandTotal: true },
        _count: true,
      }),
    ]);

    return NextResponse.json({
      stats: {
        totalProducts,
        activeProducts,
        totalOrders,
        totalCustomers,
        lowStockProducts,
        totalRevenue: revenueAgg._sum.grandTotal ?? 0,
        paidOrderCount: revenueAgg._count,
      },
      recentOrders,
    });
  } catch (error) {
    console.error('GET /api/admin/dashboard/stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats', code: 'DASHBOARD_STATS_ERROR' },
      { status: 500 }
    );
  }
}
