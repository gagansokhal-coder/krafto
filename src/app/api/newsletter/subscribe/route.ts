import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format', code: 'INVALID_EMAIL' },
        { status: 400 }
      );
    }

    // In production: add to Resend/Mailchimp/ConvertKit audience
    // For now, log and return success
    console.log('📧 Newsletter subscription:', email);

    return NextResponse.json(
      { success: true, message: 'You have been subscribed to our newsletter.' },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/newsletter/subscribe error:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe', code: 'SUBSCRIBE_ERROR' },
      { status: 500 }
    );
  }
}
