import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';

// Initialize Stripe if key exists, otherwise it will be null
const stripe = process.env.STRIPE_SECRET_KEY 
  // @ts-expect-error Stripe apiVersion type mismatch
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-04-10' }) 
  : null;

export async function POST(request: Request) {
  try {
    const { items, email, phone } = await request.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    // 1. Fetch real prices from database to prevent manipulation
    const productIds = items.map((item: { id: string }) => item.id);
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    let subtotal = 0;
    const orderItemsData = items.map((item: { id: string, quantity: number }) => {
      const dbProduct = dbProducts.find(p => p.id === item.id);
      if (!dbProduct) throw new Error(`Product ${item.id} not found`);
      
      const price = Number(dbProduct.price);
      subtotal += price * item.quantity;
      
      return {
        productId: dbProduct.id,
        name: dbProduct.name,
        quantity: item.quantity,
        unitPrice: price,
        totalPrice: price * item.quantity,
      };
    });

    const shippingCost = subtotal > 20000 ? 0 : 1500;
    const grandTotal = subtotal + shippingCost;

    // 2. Create Order in Database
    const order = await prisma.order.create({
      data: {
        orderNumber: `KRT-${Date.now().toString().slice(-6)}`,
        email: email || 'guest@example.com',
        phone: phone || '0000000000',
        shippingMethod: 'STANDARD',
        shippingCost,
        subtotal,
        grandTotal,
        items: {
          create: orderItemsData,
        },
      },
    });

    // 3. Create Stripe Session (if configured)
    if (stripe) {
      const lineItems = orderItemsData.map((item: { name: string, unitPrice: number, quantity: number }) => ({
        price_data: {
          currency: 'inr',
          product_data: {
            name: item.name,
          },
          unit_amount: item.unitPrice * 100, // Stripe expects paise
        },
        quantity: item.quantity,
      }));

      // Add shipping as a line item if applicable
      if (shippingCost > 0) {
        lineItems.push({
          price_data: {
            currency: 'inr',
            product_data: {
              name: 'Shipping',
            },
            unit_amount: shippingCost * 100,
          },
          quantity: 1,
        });
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/checkout?success=true&order=${order.orderNumber}`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/checkout?canceled=true`,
        client_reference_id: order.id,
        customer_email: email,
      });

      return NextResponse.json({ url: session.url, orderId: order.id });
    }

    // Fallback if Stripe is not configured: Just return success mock
    return NextResponse.json({ 
      success: true, 
      orderId: order.id,
      orderNumber: order.orderNumber,
      message: 'Order created successfully (Stripe not configured)' 
    });

  } catch (error) {
    console.error('Checkout API Error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
